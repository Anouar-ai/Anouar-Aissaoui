import type { Product } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_WC_API_URL;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

const auth = 'Basic ' + btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);

async function fetchWooCommerce(endpoint: string) {
  const url = `${API_URL}/${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': auth,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

function formatProduct(product: any): Product {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: parseFloat(product.price) || 0,
        images: product.images.map((img: any) => ({
          id: img.id,
          src: img.src,
          alt: img.alt || product.name,
        })),
        categories: product.categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })),
    };
}

export async function getProducts(): Promise<Product[]> {
    const products = await fetchWooCommerce('products');
    return products.map(formatProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const products = await fetchWooCommerce(`products?slug=${slug}`);
    if (products && products.length > 0) {
        return formatProduct(products[0]);
    }
    return null;
}
