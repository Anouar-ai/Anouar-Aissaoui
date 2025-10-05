"use client"
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { products } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { GlowCard } from '@/components/ui/spotlight-card';
import { reviews } from '@/lib/reviews';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

function ProductCard({ product }: { product: typeof products[0] }) {
  const { addItem } = useCart();
  return (
    <GlowCard glowColor="purple" className="p-0" customSize={true}>
      <Card className="flex flex-col overflow-hidden transition-all duration-300 w-full h-full bg-transparent border-none">
        <CardHeader className="p-0">
          <Link href={`/products/${product.id}`} className="block group">
            <div className="aspect-video overflow-hidden">
              <Image
                src={product.image.url}
                alt={product.name}
                width={600}
                height={338}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={product.image.hint}
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
          <Button onClick={() => addItem(product)}>Add to Cart</Button>
        </CardFooter>
      </Card>
    </GlowCard>
  );
}


export default function Home() {
  return (
    <div className="flex flex-col">
       <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="relative z-10">
            <Badge variant="secondary" className="mb-4">
              Now with Instant Downloads
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Premium Digital Tools, Unlocked
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Get official licenses for the best WordPress plugins and themes. Secure payments, instant downloads, and 1 year of free updates.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/#products">Browse Products</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/glow-demo">View Demo</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 z-0 bg-grid-slate-700/[0.05] [mask-image:linear-gradient(to_bottom,white,transparent,transparent)]"></div>
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
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      <section id="testimonials" className="py-16 sm:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline text-white">What Our Customers Say</h2>
            <p className="mt-3 max-w-xl mx-auto text-lg text-gray-400">
              Thousands of developers and entrepreneurs trust us. Here's what they say.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index} className="bg-background/50 border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarImage src={review.avatarUrl} alt={review.name} data-ai-hint={review.avatarHint} />
                      <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-white">{review.name}</p>
                      <div className="flex items-center text-yellow-500">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400">{review.review}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
