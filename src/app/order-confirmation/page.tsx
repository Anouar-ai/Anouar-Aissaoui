
'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const total = searchParams.get('total');

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="mt-4 text-2xl">Order Confirmed!</CardTitle>
          <CardDescription>Thank you for your purchase.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your order has been placed successfully.
          </p>
          <div className="rounded-lg bg-muted p-4 text-left">
            <div className="flex justify-between">
              <span className="font-medium">Order Number:</span>
              <span>{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Order Total:</span>
              <span className="font-bold">${total}</span>
            </div>
          </div>
          <Button asChild className="w-full">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
