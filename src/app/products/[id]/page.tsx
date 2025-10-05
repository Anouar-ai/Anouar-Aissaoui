import { notFound } from 'next/navigation';
import Link from 'next/link';
import { products } from '@/lib/products';
import ProductClient from './product-client';
import type { Metadata } from 'next';
import React from 'react';
import { slugify } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { RelatedProducts } from '@/components/related-products';

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
  
  const siteUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  return {
    title: `${product.name} | Digital Product Hub`,
    description: product.longDescription,
    alternates: {
      canonical: `/products/${product.id}`,
    },
    openGraph: {
      title: product.name,
      description: product.longDescription,
      url: `${siteUrl}/products/${product.id}`,
      siteName: 'Digital Product Hub',
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
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.longDescription,
      images: [product.image.url],
    }
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
  
  const categorySlug = slugify(product.category);

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
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link href={`/category/${categorySlug}`} className="hover:text-primary">{product.category}</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">{product.name}</span>
        </div>
        <ProductClient product={product} />
      </div>
      <RelatedProducts currentProductId={product.id} category={product.category} />
    </>
  );
}

// Statically generate these pages at build time
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}
