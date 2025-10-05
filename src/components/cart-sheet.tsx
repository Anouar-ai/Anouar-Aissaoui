'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingCart, CreditCard, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Separator } from './ui/separator';
import type { ReactNode } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '@/hooks/use-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function CartSheet({ children }: { children: ReactNode }) {
  const { cartItems, removeItem, updateQuantity, cartCount, cartTotal } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe.js has not loaded yet.');
      }
      
      const response = await fetch('/api/cart-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
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
        description: error.message || 'Could not initiate checkout.',
        variant: 'destructive',
      });
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg bg-slate-950 border-slate-800">
        <SheetHeader className="px-6">
          <SheetTitle className="text-white">Shopping Cart ({cartCount})</SheetTitle>
        </SheetHeader>
        <Separator className="bg-slate-800" />
        {cartCount > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-6 p-6 pr-6">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border border-slate-800">
                        <Image
                          src={product.image.url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          data-ai-hint={product.image.hint}
                        />
                      </div>
                      <div>
                        <Link href={`/products/${product.id}`} className="font-semibold text-white hover:text-primary">
                          {product.name}
                        </Link>
                        <p className="text-sm text-slate-400">${product.price.toFixed(2)}</p>
                        <div className="mt-2 flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-white">{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => removeItem(product.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator className="bg-slate-800" />
            <SheetFooter className="p-6 bg-slate-950/80">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-semibold text-white text-lg">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                 <Button onClick={handleCheckout} className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <><CreditCard className="mr-2" /> Proceed to Checkout</>}
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
             <div className="rounded-full border border-dashed border-slate-700 p-4">
              <ShoppingCart className="h-12 w-12 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white">Your cart is empty</h3>
            <p className="text-slate-400">Add some products to get started.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
