import { NextResponse } from "next/server";
import crypto from "crypto";
import { products } from "@/lib/products";
import { tokens } from "@/lib/token-store";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

function generateAndStoreTokens(productIds: string[]): {name: string, url: string}[] {
  const downloadUrls: {name: string, url: string}[] = [];
  
  productIds.forEach(id => {
    const product = products.find(p => p.id.trim().toLowerCase() === id.trim().toLowerCase());
    if(product) {
      const token = crypto.randomBytes(20).toString("hex");
      tokens.set(token, {
        productIds: [id], // Store single product id per token
        expires: Date.now() + 1000 * 60 * 15, // Token expires in 15 minutes
      });
      const downloadUrl = `${process.env.NEXT_PUBLIC_URL}/api/download/${token}`;
      downloadUrls.push({ name: product.name, url: downloadUrl });
    }
  });

  return downloadUrls;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session_id, productIds: localProductIds } = body as { session_id?: string; productIds?: string[] };

    let finalProductIds: string[] = [];
    let total = 0;

    if (session_id) {
        // --- Stripe Checkout Session Verification Flow ---
        const session = await stripe.checkout.sessions.retrieve(session_id);
        
        if (session.payment_status !== 'paid') {
            return NextResponse.json({ error: "Payment not successful." }, { status: 402 });
        }
        
        // Use product IDs from Stripe's metadata if available
        if (session.metadata?.productIds) {
            finalProductIds = session.metadata.productIds.split(',');
        }
        
        total = session.amount_total ? session.amount_total / 100 : 0;

    } else if (localProductIds) {
        // --- Local Payment Intent Verification Flow ---
        // This flow is for when we are NOT using Stripe checkout redirect
        finalProductIds = localProductIds;
        total = localProductIds.reduce((acc, id) => {
            const product = products.find(p => p.id === id);
            return acc + (product ? product.price : 0);
        }, 0);
    } else {
        return NextResponse.json({ error: "Missing session_id or productIds" }, { status: 400 });
    }

    if (finalProductIds.length === 0) {
        return NextResponse.json({ error: "No products found in purchase" }, { status: 400 });
    }

    const downloadUrls = generateAndStoreTokens(finalProductIds);

    return NextResponse.json({ downloadUrls, total });

  } catch (error: any) {
    console.error("Error verifying session and generating tokens:", error);
    return NextResponse.json({ error: "Invalid request or server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
