import { NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";
import { products } from "@/lib/products";
import { tokens } from "@/lib/token-store";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

function generateAndStoreTokens(productIds: string[]): {name: string, url: string}[] {
  const downloadUrls: {name: string, url: string}[] = [];
  
  productIds.forEach(id => {
    const product = products.find(p => p.id === id);
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not successful" }, { status: 402 });
    }

    const productIds = session.metadata?.productIds?.split(',') || [];
    if (productIds.length === 0) {
        return NextResponse.json({ error: "No products found in order" }, { status: 404 });
    }

    const downloadUrls = generateAndStoreTokens(productIds);

    return NextResponse.json({ downloadUrls });

  } catch (error: any) {
    console.error("Error verifying payment session:", error);
    return NextResponse.json({ error: "Invalid payment session or server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
