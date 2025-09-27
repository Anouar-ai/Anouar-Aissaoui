import type { Product } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_WC_API_URL;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

const authHeader = 'Basic ' + Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

function formatProduct(product: any): Product {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: parseFloat(product.price),
        images: product.images.map((img: any) => ({ id: img.id, src: img.src, alt: img.alt })),
        categories: product.categories.map((cat: any) => ({ id: cat.id, name: cat.name, slug: cat.slug })),
    };
}


export async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/products`, {
        headers: {
            'Authorization': authHeader
        }
    });
    const productsData = await res.json();
    return productsData.map(formatProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const res = await fetch(`${API_URL}/products?slug=${slug}`, {
         headers: {
            'Authorization': authHeader
        }
    });
    const products = await res.json();
    if (products && products.length > 0) {
        return formatProduct(products[0]);
    }
    return null;
}
