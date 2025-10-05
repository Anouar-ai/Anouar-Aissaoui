'use client'
import { useState } from 'react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Star, Plus, Minus, Loader2 } from 'lucide-react';
import { products } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '@/hooks/use-cart';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const params = useParams();
  const { addItem } = useCart();
  
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

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
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Failed to create checkout session.');
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

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <Card className="overflow-hidden bg-secondary/30">
          <CardContent className="p-0">
            <div className="aspect-video relative">
              <Image
                src={product.image.url}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint={product.image.hint}
                priority
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col">
          <Badge variant="outline" className="w-fit mb-2 border-primary/50 text-primary">{product.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 font-headline">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>
          <p className="text-3xl font-bold text-primary mb-6">${product.price.toFixed(2)}</p>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {product.longDescription}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center text-lg font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setQuantity(q => q + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" onClick={handleAddToCart} variant="outline" className="flex-1">
              Add to Cart
            </Button>
          </div>
           <Button size="lg" onClick={handleBuyNow} className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Buy Now'}
            </Button>
          
          <div className="border-t border-border/50 pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-2">License Details:</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>1 Year of Official Updates</li>
              <li>1 Year of Premium Support</li>
              <li>Use on a single website</li>
              <li>100% Genuine and Secure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
