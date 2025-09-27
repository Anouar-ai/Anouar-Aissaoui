
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_WC_API_URL;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

export async function POST(request: Request) {
  const orderData = await request.json();

  const url = `${API_URL}/orders`;
  const auth = 'Basic ' + btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error('WooCommerce API Error:', errorBody);
        return NextResponse.json({ error: 'Failed to create order', details: errorBody }, { status: response.status });
    }

    const order = await response.json();
    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
