import React from 'react';
import { products } from '@/lib/products';
import { ProductCard } from './product-card';

export function RelatedProducts({ currentProductId, category }: { currentProductId: string; category: string }) {
  const related = products
    .filter(p => p.category === category && p.id !== currentProductId)
    .slice(0, 3);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline text-white">You Might Also Like</h2>
          <p className="mt-3 max-w-xl mx-auto text-lg text-gray-400">
            Other products in the {category} category.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {related.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
