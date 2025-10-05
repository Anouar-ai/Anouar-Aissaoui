'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const { clearCart, cartItems, cartTotal } = useCart();
    const router = useRouter();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL is not used for direct confirmation, but good to have
                return_url: `${window.location.origin}/checkout/success`,
            },
            redirect: "if_required" // This is key to prevent immediate redirection
        });
        
        if (error) {
            setMessage(error.message || "An unexpected error occurred.");
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
             toast({
                title: "Payment Successful!",
                description: "Your order is confirmed. Redirecting...",
            });

            // Save purchase details for success page
            localStorage.setItem('purchase', JSON.stringify({ items: cartItems, total: cartTotal }));

            clearCart();
            
            // Manually redirect to success page
            router.push('/checkout/success');
        } else {
             setIsLoading(false);
        }
    };
    
    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <Button disabled={isLoading || !stripe || !elements} id="submit" className="w-full mt-6 text-lg">
                <span id="button-text">
                    {isLoading ? "Processing..." : `Pay $${cartTotal.toFixed(2)}`}
                </span>
            </Button>
            {message && <div id="payment-message" className="text-red-500 mt-2 text-sm">{message}</div>}
        </form>
    );
}


export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Redirect if the cart is empty
    if (cartCount === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Redirecting to homepage...',
      });
      router.push('/');
    }
  }, [cartCount, router, toast]);

  useEffect(() => {
    if (cartCount > 0) {
        // Create PaymentIntent as soon as the page loads with cart items
        fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItems }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.clientSecret) {
                setClientSecret(data.clientSecret)
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Failed to initialize payment.',
                    variant: 'destructive',
                })
            }
        });
    }
  }, [cartItems, cartCount, toast]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
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
            <CardTitle>Complete Your Payment</CardTitle>
          </CardHeader>
          <CardContent>
            {clientSecret ? (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            ) : (
              <div className="text-center">
                  <p>Initializing payment form...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
