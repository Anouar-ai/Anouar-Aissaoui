import type { Product } from '@/lib/types';
import { getImageById } from '@/lib/placeholder-images';

const API_URL = process.env.NEXT_PUBLIC_WC_API_URL;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

async function fetchWooCommerce(endpoint: string) {
  const url = `${API_URL}/${endpoint}`;
  const auth = 'Basic ' + btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
  
  const response = await fetch(url, {
    headers: {
      'Authorization': auth,
    },
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from WooCommerce: ${response.statusText}`);
  }
  return response.json();
}

export async function getProducts(): Promise<Product[]> {
  const data = await fetchWooCommerce('products');
  return data;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const products = await fetchWooCommerce(`products?slug=${slug}`);
    if (products && products.length > 0) {
      return products[0];
    }
    return null;
}
