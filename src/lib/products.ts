import { gql } from '@apollo/client';
import client from './apollo';
import type { Product } from '@/lib/types';

const GET_PRODUCTS = gql`
  query GetProducts {
    products(first: 20) {
      nodes {
        id
        databaseId
        name
        slug
        description
        ... on SimpleProduct {
          price
        }
        ... on VariableProduct {
          price
        }
        image {
          sourceUrl
          altText
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
      ... on SimpleProduct {
        price
      }
      ... on VariableProduct {
        price
      }
      image {
        sourceUrl
        altText
      }
       categories {
          nodes {
            id
            name
            slug
          }
        }
    }
  }
`;


function formatPrice(priceString: string | null | undefined): number {
  if (!priceString) return 0;
  // Remove currency symbols, thousands separators, and parse it
  const numericString = priceString.replace(/[^0-9.]/g, '');
  return parseFloat(numericString) || 0;
}

function formatProduct(product: any): Product {
    return {
        id: product.databaseId,
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: formatPrice(product.price),
        images: product.image ? [{ id: product.databaseId, src: product.image.sourceUrl, alt: product.image.altText || product.name }] : [],
        categories: product.categories?.nodes.map((cat: any) => ({ id: cat.id, name: cat.name, slug: cat.slug })) || [],
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
