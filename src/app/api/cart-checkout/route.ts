import { NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "@/lib/products";
import type { CartItem } from "@/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { cartItems: CartItem[] };
    const { cartItems } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const productIds: string[] = [];

    for (const item of cartItems) {
        const product = products.find(p => p.id === item.product.id);
        if (product) {
            line_items.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        description: product.description,
                        images: [product.image.url],
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: item.quantity,
            });
            productIds.push(product.id);
        }
    }
    
    if(line_items.length === 0) {
        return NextResponse.json({ error: "No valid products in cart." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: line_items,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/`, // Redirect to homepage on cancel
        metadata: {
            productIds: productIds.join(','),
        }
    });

    if (!session.id) {
        return NextResponse.json({ error: "Could not create Stripe session." }, { status: 500 });
    }

    return NextResponse.json({ sessionId: session.id });

  } catch (error: any) {
    console.error("Error creating Stripe Checkout session for cart:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
