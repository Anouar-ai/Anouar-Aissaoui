'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cartTotal, cartItems, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // No return_url needed for this flow
        },
        redirect: 'if_required', // Important: prevents automatic redirection
      });

      if (error) {
        throw new Error(error.message || 'An unexpected error occurred.');
      }
      
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded. Now generate download links.
        const productIds = cartItems.map(item => item.product.id);
        const res = await fetch('/api/verify-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productIds }),
        });

        if (!res.ok) {
            throw new Error('Failed to generate download links after payment.');
        }

        const data = await res.json();
        
        // Save purchase details to local storage for success page
        localStorage.setItem('purchase', JSON.stringify({ 
            downloadUrls: data.downloadUrls,
            total: cartTotal 
        }));
        
        clearCart();
        router.push('/checkout/success');
      } else {
         throw new Error('Payment was not successful. Please try again.');
      }

    } catch (error: any) {
      setErrorMessage(error.message);
      toast({
        title: 'Payment Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {errorMessage && <div className="text-destructive text-sm font-medium">{errorMessage}</div>}
      <Button disabled={isLoading || !stripe} className="w-full text-lg" size="lg">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay $${cartTotal.toFixed(2)}`
        )}
      </Button>
    </form>
  )
}


export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (cartCount === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Redirecting to homepage...',
      });
      router.push('/');
      return;
    }

    // Create PaymentIntent as soon as the page loads
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems }),
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error('Failed to create payment intent');
        }
        return res.json();
    })
    .then((data) => {
        setClientSecret(data.clientSecret);
    })
    .catch((error) => {
        toast({
            title: 'Error',
            description: error.message || 'Could not load payment provider.',
            variant: 'destructive',
        });
        router.push('/');
    })
    .finally(() => {
        setIsLoading(false);
    });

  }, [cartCount, cartItems, router, toast]);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#6a0dad', // primary color from globals.css HSL
      },
    }
  };

  if (cartCount === 0 || isLoading) {
    return (
        <div className="container mx-auto px-4 py-8 md:py-16 text-center flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">{cartCount === 0 ? 'Your cart is empty. Redirecting...' : 'Preparing your secure payment...'}</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-center font-headline">Review & Pay</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="lg:order-2">
           <Card className="w-full">
                <CardHeader>
                    <CardTitle>Secure Payment</CardTitle>
                </CardHeader>
                <CardContent>
                    {clientSecret ? (
                      <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm />
                      </Elements>
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    )}
                </CardContent>
            </Card>
        </div>
        <Card className="lg:order-1">
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
      </div>
    </div>
  );
}