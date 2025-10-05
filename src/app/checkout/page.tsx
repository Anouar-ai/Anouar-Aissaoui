'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (cartCount === 0) {
      router.push('/');
    }
  }, [cartCount, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would process the payment here.
    alert('Payment successful! Your order has been placed.');
    clearCart();
    router.push('/account/orders');
  };

  if (cartCount === 0) {
    return null; // or a loading spinner
  }
  
  const shipping = 0; // Digital products
  const tax = cartTotal * 0.08; // Example tax
  const total = cartTotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-center font-headline">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-name">Name on Card</Label>
                <Input id="card-name" type="text" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" type="text" placeholder="**** **** **** 1234" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiration</Label>
                  <Input id="expiry" type="text" placeholder="MM/YY" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" type="text" placeholder="123" required />
                </div>
              </div>
            </form>
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
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>${shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Taxes</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                    </div>
                    <Separator />
                     <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" form="payment-form" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        Pay ${total.toFixed(2)}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
