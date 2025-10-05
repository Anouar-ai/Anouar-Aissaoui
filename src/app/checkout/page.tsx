'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (cartCount === 0 && !isLoading) {
      toast({
        title: 'Your cart is empty',
        description: 'Redirecting to homepage...',
      });
      router.push('/');
    }
  }, [cartCount, router, toast, isLoading]);
  
  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

      if (!stripe) {
        throw new Error('Stripe.js failed to load.');
      }
      
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
      });

      if (!res.ok) {
        throw new Error('Failed to create checkout session.');
      }

      const session = await res.json();

      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to redirect to checkout.');
      }
    } catch (error: any) {
      toast({
        title: 'Checkout Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };


  if (cartCount === 0) {
    return (
        <div className="container mx-auto px-4 py-8 md:py-16 text-center">
            <p>Your cart is empty. Redirecting to homepage...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-center font-headline">Review Your Order</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {cartItems.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                <Image src={product.image.url} alt={product.name} fill className="object-cover" data-ai-hint={product.image.hint} />
                            </div>
                            <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                            </div>
                        </div>
                        <p className="font-semibold text-lg">${(product.price * quantity).toFixed(2)}</p>
                    </div>
                ))}
                <Separator />
                 <div className="space-y-2 text-base">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxes & Fees</span>
                        <span>Calculated at checkout</span>
                    </div>
                </div>
                <Separator />
                 <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
            </CardContent>
        </Card>
        
        <div className="flex flex-col items-center justify-center space-y-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Complete Your Purchase</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">
                        You will be redirected to our secure payment partner, Stripe, to complete your purchase.
                    </p>
                    <Button onClick={handleCheckout} disabled={isLoading} className="w-full text-lg" size="lg">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Redirecting to Stripe...
                        </>
                      ) : (
                        `Proceed to Checkout ($${cartTotal.toFixed(2)})`
                      )}
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
