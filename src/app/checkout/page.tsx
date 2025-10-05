'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const total = cartTotal;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        receipt_email: email,
      },
    });

    if (error) {
      toast({
        title: "Payment failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      localStorage.setItem('purchase', JSON.stringify({
        items: cartItems,
        total: cartTotal,
        date: new Date().toISOString(),
      }));
      clearCart();
      router.push('/checkout/success');
    }

    setIsLoading(false);
  };
  
  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      
      <PaymentElement />
      
      <Button disabled={isLoading || !stripe || !elements} type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-4">
        {isLoading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </Button>
    </form>
  )
}


export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount } = useCart();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cartCount > 0) {
      createPaymentIntent(cartTotal).then(data => {
        if(data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
        setLoading(false);
      });
    } else {
        router.push('/');
    }
  }, [cartCount, cartTotal, router]);


  if (loading) {
    return (
        <div className="container mx-auto px-4 py-8 md:py-16 text-center">
            <p>Loading checkout...</p>
        </div>
    );
  }
  
  if (cartCount === 0 && !clientSecret) {
    // This case will be hit if the user navigates here with an empty cart.
    // It shouldn't show a redirecting message indefinitely.
    // The useEffect will handle the redirect.
    return (
        <div className="container mx-auto px-4 py-8 md:py-16 text-center">
            <p>Your cart is empty. Redirecting to homepage...</p>
        </div>
    );
  }

  if (!clientSecret) {
    return (
        <div className="container mx-auto px-4 py-8 md:py-16 text-center">
            <p>Could not initialize payment. Please try again.</p>
        </div>
    );
  }
  
  const total = cartTotal;

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-center font-headline">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {cartItems.map(({ product, quantity }) => (
                        <div key={product.id} className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="relative h-12 w-12 rounded-md overflow-hidden">
                                    <Image src={product.image.url} alt={product.name} fill className="object-cover" data-ai-hint={product.image.hint} />
                                </div>
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                                </div>
                            </div>
                            <p className="font-medium">${(product.price * quantity).toFixed(2)}</p>
                        </div>
                    ))}
                    <Separator />
                     <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    <Separator />
                     <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}