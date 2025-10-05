
import Image from 'next/image';
import Link from 'next/link';
import { Star, MoveRight } from 'lucide-react';
import { products } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GlowCard } from '@/components/ui/spotlight-card';
import React from 'react';

function ProductCard({ product, priority = false }: { product: typeof products[0], priority?: boolean }) {
  return (
    <GlowCard glowColor="purple" className="p-0" customSize={true}>
      <Card className="flex flex-col overflow-hidden transition-all duration-300 w-full h-full bg-transparent border-none">
        <CardHeader className="p-0">
          <Link href={`/products/${product.id}`} className="block group">
            <div className="aspect-video overflow-hidden relative">
              <Image
                src={product.image.url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={product.image.hint}
                priority={priority}
              />
            </div>
          </Link>
        </CardHeader>
        <CardContent className="p-6 flex-grow">
          <Badge variant="outline" className="mb-2 border-purple-300/50 text-purple-300">{product.category}</Badge>
          <CardTitle className="text-xl font-bold mb-2 leading-tight text-white">
            <Link href={`/products/${product.id}`} className="hover:text-primary">
              {product.name}
            </Link>
          </CardTitle>
          <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
          <div className="flex items-center mt-4">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="text-xs text-gray-400 ml-2">({product.reviews} reviews)</span>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex justify-between items-center">
          <p className="text-2xl font-bold text-primary">${product.price}</p>
          <Button asChild variant="outline">
             <Link href={`/products/${product.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </GlowCard>
  );
}


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
              <ProductCard key={product.id} product={product} priority={index === 0} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
