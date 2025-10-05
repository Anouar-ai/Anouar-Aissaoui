'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect if the cart is empty and we're not in the middle of a checkout process
    if (cartCount === 0 && !isLoading) {
      toast({
        title: 'Your cart is empty',
        description: 'Redirecting to homepage...',
      });
      router.push('/');
    }
  }, [cartCount, router, isLoading, toast]);
  
  const handleCheckout = async () => {
    setIsLoading(true);
    toast({
        title: "Redirecting to Checkout",
        description: "Please wait while we prepare your secure payment page.",
    });

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
      });
      
      const session = await res.json();

      if (res.status !== 200 || !session.url) {
        throw new Error(session.error || 'Failed to create checkout session.');
      }
      
      // Redirect the top-level window to break out of the iframe
      if (window.top) {
        window.top.location.href = session.url;
      } else {
        window.location.href = session.url;
      }

    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: 'Checkout Error',
        description: error.message || 'An unexpected error occurred during checkout.',
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
        <div className="space-y-8">
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
                            <span>Calculated at next step</span>
                        </div>
                    </div>
                    <Separator />
                     <div className="flex justify-between font-bold text-xl">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Ready to Complete Your Order?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              You will be redirected to our secure payment partner, Stripe, to complete your purchase using your credit card.
            </p>
            <Button 
              onClick={handleCheckout} 
              disabled={isLoading}
              size="lg" 
              className="w-full text-lg"
            >
              {isLoading ? 'Processing...' : `Proceed to Secure Payment`}
            </Button>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Your security is our priority. All transactions are encrypted and processed securely by Stripe.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
