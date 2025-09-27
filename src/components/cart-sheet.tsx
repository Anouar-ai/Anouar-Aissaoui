"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import ProductRecommendations from "./ai/product-recommendations";

export function CartSheet() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, cartCount } = useCart();

  const handleCheckout = () => {
    // In a real app, this would build a checkout URL and redirect.
    // For this demo, we'll just log to the console and show an alert.
    console.log("Redirecting to WooCommerce checkout with items:", cartItems);
    alert("Redirecting to checkout! (See browser console for details)");
    // A real implementation would look something like this:
    // window.location.href = `https://your-woocommerce-site.com/checkout`;
  };

  return (
    <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
      <SheetHeader className="px-6">
        <SheetTitle>Cart ({cartCount})</SheetTitle>
      </SheetHeader>
      <Separator />
      {cartItems.length > 0 ? (
        <>
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="flex flex-col gap-6">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-start gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                       <Image
                          src={item.product.image.url}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                          data-ai-hint={item.product.image.hint}
                        />
                    </div>
                    <div className="flex-1">
                      <Link href={`/products/${item.product.slug}`} className="font-medium hover:underline">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                            <Minus className="h-4 w-4"/>
                          </Button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4"/>
                          </Button>
                        </div>
                         <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.product.id)}>
                          <Trash2 className="h-4 w-4"/>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 pt-0">
              <ProductRecommendations />
            </div>
          </div>
          <SheetFooter className="bg-secondary p-6">
            <div className="w-full space-y-4">
               <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </SheetFooter>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground">Your cart is empty.</p>
        </div>
      )}
    </SheetContent>
  );
}
