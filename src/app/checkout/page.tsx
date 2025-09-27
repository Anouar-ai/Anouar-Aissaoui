
"use client";

import { useCart } from "@/context/CartContext";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function StripeForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      toast({
        title: "Error",
        description: submitError.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems }),
    });

    const { clientSecret } = await res.json();

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
      redirect: "if_required",
    });

    if (error) {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      const orderData = {
        payment_method: "stripe",
        payment_method_title: "Credit Card (Stripe)",
        set_paid: true,
        billing: {
          first_name: "John", // These would come from a form
          last_name: "Doe",
          email: "john.doe@example.com",
          address_1: "123 Test St",
          city: "Testville",
          country: "US"
        },
        line_items: cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        meta_data: [
          {
            key: "_stripe_payment_intent_id",
            value: paymentIntent.id
          }
        ]
      };
  
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!orderRes.ok) {
        toast({
            title: "Order creation failed",
            description: "Your payment was successful, but we couldn't create your order. Please contact support.",
            variant: "destructive",
        })
      } else {
        const order = await orderRes.json();
        clearCart();
        router.push(`/order-confirmation?order_id=${order.id}&total=${order.total}`);
      }
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={loading || !stripe || !elements}
        className="w-full"
        size="lg"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Pay Now"}
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const { cartItems, totalPrice } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (totalPrice > 0) {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
  }, [cartItems, totalPrice]);


  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="mb-4 text-3xl font-bold">Your cart is empty.</h1>
        <Button onClick={() => window.location.href = '/'}>Go Shopping</Button>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#673ab7',
        colorBackground: '#f5f5f5',
        colorText: '#242424',
        colorDanger: '#df1b41',
        fontFamily: 'Inter, sans-serif',
        borderRadius: '0.5rem',
      },
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Checkout</h1>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              {clientSecret ? (
                <Elements stripe={stripePromise} options={options}>
                  <StripeForm />
                </Elements>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-4 font-semibold">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
