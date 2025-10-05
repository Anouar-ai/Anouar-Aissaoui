
"use client"
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { products } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GlowCard } from '@/components/ui/spotlight-card';
import { reviews } from '@/lib/reviews';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function ProductCard({ product }: { product: typeof products[0] }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNow = async () => {
    setIsLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe.js has not loaded yet.');
      }

      const response = await fetch('/api/buy-now', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session.');
      }

      const { sessionId } = await response.json();

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Could not initiate checkout. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };
  
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
          <Button onClick={handleBuyNow} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Buy Now'}
          </Button>
        </CardFooter>
      </Card>
    </GlowCard>
  );
}


export default function Home() {
  return (
    <div className="flex flex-col">
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
    </div>
  );
}
