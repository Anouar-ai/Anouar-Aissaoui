
import Image from 'next/image';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';
import { products } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import React from 'react';


export default function Home() {
  return (
    <div className="flex flex-col">
       <section className="relative py-24 sm:py-32 bg-grid-slate-700/[0.4] border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          <div className="container mx-auto px-4 text-center relative">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 font-headline bg-gradient-to-br from-white to-slate-400 text-transparent bg-clip-text">
              Premium Digital Tools, Instantly.
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-400">
              Get official licenses for the best WordPress plugins and themes. Secure, instant, and ready to deploy.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="#products">Explore Products <MoveRight className="ml-2" /></Link>
              </Button>
            </div>
          </div>
        </section>
      <section id="products" className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline text-white">Our Products</h2>
            <p className="mt-3 max-w-xl mx-auto text-lg text-gray-400">
              Hand-picked, premium tools to build and grow your online presence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 3} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
