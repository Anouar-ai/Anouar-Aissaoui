import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { slugify } from '@/lib/utils';
import React from 'react';

const getCategoryNameFromSlug = (slug: string): string | null => {
    const categoryMap: { [key: string]: string } = {
        'wordpress-plugin': 'WordPress Plugin',
        'wordpress-theme': 'WordPress Theme',
    };
    return categoryMap[slug] || null;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const categoryName = getCategoryNameFromSlug(params.slug);

    if (!categoryName) {
        return {
            title: 'Category not found',
        };
    }

    return {
        title: `${categoryName} | Digital Product Hub`,
        description: `Browse all ${categoryName} available on Digital Product Hub.`,
    };
}


export default function CategoryPage({ params }: { params: { slug: string } }) {
    const categoryName = getCategoryNameFromSlug(params.slug);

    if (!categoryName) {
        notFound();
    }

    const categoryProducts = products.filter(
        (product) => slugify(product.category) === params.slug
    );

    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline text-white">
                    {categoryName}
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                    Discover our collection of premium {categoryName.toLowerCase()}.
                </p>
            </div>
            {categoryProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-slate-400">
                    <p>No products found in this category.</p>
                </div>
            )}
        </div>
    );
}

// Optional: If you want to statically generate these pages at build time
export async function generateStaticParams() {
  const categories = [...new Set(products.map(p => p.category))];
  return categories.map(category => ({
    slug: slugify(category),
  }));
}