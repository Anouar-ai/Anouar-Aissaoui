import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import ProductClient from './product-client';
import type { Metadata } from 'next';
import React from 'react';
import { slugify } from '@/lib/utils';

type Props = {
  params: { id: string }
}

export const revalidate = 3600; // Revalidate at most once per hour

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = products.find((p) => p.id === params.id);
  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | Digital Product Hub`,
    description: product.longDescription,
    alternates: {
      canonical: `/products/${product.id}`,
    },
    openGraph: {
      title: product.name,
      description: product.longDescription,
      images: [
        {
          url: product.image.url,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: 'website',
    },
  }
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.longDescription,
    image: product.image.url,
    sku: product.id,
    brand: {
        '@type': 'Brand',
        name: 'Digital Product Hub'
    },
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_URL}/products/${product.id}`
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
  };
  
  const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${process.env.NEXT_PUBLIC_URL}`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: product.category,
          item: `${process.env.NEXT_PUBLIC_URL}/category/${slugify(product.category)}`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.name
        }
      ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="container mx-auto px-4 py-8 md:py-16">
        <ProductClient product={product} />
      </div>
    </>
  );
}

// Statically generate these pages at build time
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}
