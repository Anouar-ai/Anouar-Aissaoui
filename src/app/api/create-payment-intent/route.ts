import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import type { CartItem } from '@/lib/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Ensure this matches your product data structure
interface Product {
  id: number;
  price: number;
  name: string;
}

interface CartItemForApi {
  product: Product;
  quantity: number;
}


async function getProductsFromWooCommerce(productIds: number[]) {
    const API_URL = process.env.NEXT_PUBLIC_WC_API_URL;
    const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
    const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;
    const auth = 'Basic ' + btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);

    const url = `${API_URL}/products?include=${productIds.join(',')}&per_page=100`;

    try {
        const response = await fetch(url, {
            headers: { 'Authorization': auth },
        });

        if (!response.ok) {
            console.error("WooCommerce API Error:", await response.text());
            return [];
        }
        const products = await response.json();
        return products.map((p: any) => ({
            id: p.id,
            price: parseFloat(p.price)
        }));
    } catch (error) {
        console.error("Failed to fetch products from WooCommerce", error);
        return [];
    }
}


export async function POST(request: Request) {
  const { cartItems }: { cartItems: CartItem[] } = await request.json();

  if (!cartItems || cartItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  try {
     const productIds = cartItems.map(item => item.product.id);
     const wooProducts = await getProductsFromWooCommerce(productIds);

     const amount = cartItems.reduce((total, item) => {
        const wooProduct = wooProducts.find(p => p.id === item.product.id);
        const price = wooProduct ? wooProduct.price : 0;
        return total + price * item.quantity;
     }, 0);
     
    // Add a flat shipping rate
    const shippingAmount = 0;
    const totalAmount = amount + shippingAmount;

    if (totalAmount <= 0) {
        return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Amount should be in cents
    const amountInCents = Math.round(totalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        cart: JSON.stringify(cartItems.map(item => ({ id: item.product.id, name: item.product.name, quantity: item.quantity })))
      }
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
