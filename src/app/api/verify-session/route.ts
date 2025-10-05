import { NextResponse } from "next/server";
import crypto from "crypto";
import { products } from "@/lib/products";
import { tokens } from "@/lib/token-store";

// Note: This route is now used after a successful local payment intent, not a Stripe Checkout session.
// The name is kept for compatibility with the previous flow, but its logic has changed.

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productIds } = body as { productIds: string[] };

    if (!productIds || productIds.length === 0) {
        return NextResponse.json({ error: "No product IDs provided" }, { status: 400 });
    }

    const downloadUrls = generateAndStoreTokens(productIds);

    return NextResponse.json({ downloadUrls });

  } catch (error: any) {
    console.error("Error generating download tokens:", error);
    return NextResponse.json({ error: "Invalid request or server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
    // Keeping the GET handler to avoid breaking old logic if it's still being called,
    // but directing to use POST.
    return NextResponse.json({ error: "Please use POST method to verify purchase." }, { status: 405 });
}


export const dynamic = "force-dynamic";