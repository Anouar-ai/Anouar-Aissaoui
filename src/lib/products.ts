
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
          productCategories {
            nodes {
              id
              name
              slug
            }
          }
        }
        ... on VariableProduct {
          price
          productCategories {
            nodes {
              id
              name
              slug
            }
          }
        }
        image {
          sourceUrl
          altText
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
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
      }
      ... on VariableProduct {
        price
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
      }
      image {
        sourceUrl
        altText
      }
    }
  }
`;


function formatPrice(priceString: string | null | undefined): number {
  if (!priceString) return 0;
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
        categories: product.productCategories?.nodes.map((cat: any) => ({ id: cat.id, name: cat.name, slug: cat.slug })) || [],
    };
}


async function fetchGraphQL(query: any, variables = {}) {
    const origin = typeof window === 'undefined' ? (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002') : '';
    const response = await fetch(`${origin}/api/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: query.loc.source.body,
            variables,
        }),
        cache: 'no-store'
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`GraphQL request failed: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(`Failed to fetch from GraphQL API: ${errorBody}`);
    }

    const { data, errors } = await response.json();
    if (errors) {
        console.error('GraphQL Errors:', errors);
        throw new Error(`GraphQL query returned errors: ${JSON.stringify(errors)}`);
    }

    return data;
}


export async function getProducts(): Promise<Product[]> {
    const data = await fetchGraphQL(GET_PRODUCTS);
    if (!data.products || !data.products.nodes) {
        console.error("No products found in GraphQL response:", data);
        return [];
    }
    return data.products.nodes.map(formatProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const data = await fetchGraphQL(GET_PRODUCT_BY_SLUG, { slug });
    if (data.product) {
        return formatProduct(data.product);
    }
    return null;
}
