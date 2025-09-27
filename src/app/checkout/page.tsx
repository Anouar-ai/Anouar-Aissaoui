
"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const router = useRouter();

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formProps = Object.fromEntries(formData);

    const orderData = {
      payment_method: "bacs",
      payment_method_title: "Direct Bank Transfer",
      set_paid: false,
      billing: {
        first_name: formProps.first_name,
        last_name: formProps.last_name,
        address_1: formProps.address_1,
        city: formProps.city,
        country: formProps.country,
        email: formProps.email,
        phone: formProps.phone,
      },
      shipping: {
        first_name: formProps.first_name,
        last_name: formProps.last_name,
        address_1: formProps.address_1,
        city: formProps.city,
        country: formProps.country,
      },
      line_items: cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
      shipping_lines: [
        {
          method_id: "flat_rate",
          method_title: "Flat Rate",
          total: "10.00",
        },
      ],
    };

    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();
      clearCart();
      router.push(`/order-confirmation?order_id=${order.id}&total=${order.total}`);
    } catch (error) {
      console.error(error);
      alert("There was an error placing your order. Please try again.");
    }
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Checkout</h1>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>
                Enter your shipping details below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheckout} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" name="first_name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" name="last_name" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_1">Address</Label>
                  <Input id="address_1" name="address_1" required />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" required />
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Place Order
                </Button>
              </form>
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
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-4 font-semibold">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
               <div className="flex justify-between font-semibold">
                <span>Shipping</span>
                <span>$10.00</span>
              </div>
              <div className="flex justify-between border-t pt-4 text-lg font-bold">
                <span>Total</span>
                <span>${(totalPrice + 10).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
