import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import ProductClient from './product-client';
import type { Metadata } from 'next';
import React from 'react';

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

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <ProductClient product={product} />
    </div>
  );
}

// Statically generate these pages at build time
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}
