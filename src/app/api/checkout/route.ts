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

    const totalAmount = cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity, 0
    );

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // amount in cents
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
         // Attach product IDs to metadata for your records
        metadata: {
            productIds: cartItems.map(item => item.product.id).join(','),
        },
    });
    
    return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
    });

  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent." },
      { status: 500 }
    );
  }
}
