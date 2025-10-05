import { NextResponse } from "next/server";
import Stripe from "stripe";
import type { CartItem } from "@/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { cartItems: CartItem[] };
    const { cartItems } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map(item => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.product.name,
                description: item.product.description,
                images: [item.product.image.url]
            },
            unit_amount: Math.round(item.product.price * 100), // price in cents
        },
        quantity: item.quantity,
    }));

    const productIds = cartItems.map(item => item.product.id).join(',');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`, // Go back to checkout page on cancel
      metadata: { 
        productIds: productIds 
      },
    });

    return NextResponse.json({ id: session.id });

  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
