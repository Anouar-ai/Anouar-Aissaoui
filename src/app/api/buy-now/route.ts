import { NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "@/lib/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { productId: string; quantity: number };
    const { productId, quantity = 1 } = body;

    if (!productId || quantity < 1) {
      return NextResponse.json({ error: "Invalid product or quantity." }, { status: 400 });
    }

    const product = products.find(p => p.id === productId);

    if (!product) {
        return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        description: product.description,
                        images: [product.image.url]
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: quantity,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/products/${product.id}`,
        metadata: {
            // We pass the product ID here to retrieve it in the webhook or verification step
            productIds: product.id,
        }
    });

    if (!session.id) {
        return NextResponse.json({ error: "Could not create Stripe session." }, { status: 500 });
    }

    return NextResponse.json({ sessionId: session.id });

  } catch (error: any) {
    console.error("Error creating Stripe Checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
