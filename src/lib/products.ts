import type { Product } from '@/lib/types';
import client from './apollo';
import { GET_PRODUCTS, GET_PRODUCT_BY_SLUG } from '@/queries/products';

function formatProduct(product: any): Product {
    return {
        id: product.databaseId,
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: parseFloat(product.price),
        images: product.image ? [{ id: 0, src: product.image.sourceUrl, alt: product.name }] : [],
        categories: [],
    };
}


export async function getProducts(): Promise<Product[]> {
  const { data } = await client.query({ query: GET_PRODUCTS });
  return data.products.nodes.map(formatProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const { data } = await client.query({
        query: GET_PRODUCT_BY_SLUG,
        variables: { slug },
    });
    if (data.product) {
        return formatProduct(data.product);
    }
    return null;
}
