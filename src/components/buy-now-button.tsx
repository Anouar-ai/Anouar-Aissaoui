'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function BuyNowButton({ productId, quantity = 1 }: { productId: string, quantity?: number }) {
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
        body: JSON.stringify({ productId: productId, quantity: quantity }),
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
  
  return (
    <Button onClick={handleBuyNow} disabled={isLoading} size="lg" className="w-full">
      {isLoading ? <Loader2 className="animate-spin" /> : 'Buy Now'}
    </Button>
  );
}
