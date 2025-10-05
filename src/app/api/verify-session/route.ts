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
    const { session_id } = body as { session_id?: string };

    if (!session_id) {
        return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }
    
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status !== 'paid') {
        return NextResponse.json({ error: "Payment not successful." }, { status: 402 });
    }
    
    const productIds = session.metadata?.productIds?.split(',') || [];
    const total = session.amount_total ? session.amount_total / 100 : 0;


    if (productIds.length === 0) {
        return NextResponse.json({ error: "No products found in purchase metadata." }, { status: 400 });
    }

    const downloadUrls = generateAndStoreTokens(productIds);
    
    if (downloadUrls.length === 0) {
      return NextResponse.json({ error: "Could not generate download links for the purchased products." }, { status: 500 });
    }

    return NextResponse.json({ downloadUrls, total });

  } catch (error: any) {
    console.error("Error verifying session and generating tokens:", error);
    // Provide a more generic error to the client
    if (error instanceof Stripe.errors.StripeError) {
        return NextResponse.json({ error: "Could not verify payment with our provider." }, { status: 500 });
    }
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
