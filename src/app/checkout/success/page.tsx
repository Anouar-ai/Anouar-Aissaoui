'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { CartItem } from '@/types';
import Image from 'next/image';

interface Purchase {
  items: CartItem[];
  total: number;
  date: string;
}

export default function SuccessPage() {
  const router = useRouter();
  const [purchase, setPurchase] = useState<Purchase | null>(null);

  useEffect(() => {
    const purchaseData = localStorage.getItem('purchase');
    if (purchaseData) {
      setPurchase(JSON.parse(purchaseData));
      localStorage.removeItem('purchase'); // Clear it after reading
    } else {
      router.push('/');
    }
  }, [router]);

  if (!purchase) {
    return (
        <div className="container mx-auto px-4 py-8 md:py-16 text-center">
            <p>Loading your order details...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-fit bg-green-100 dark:bg-green-900/50 rounded-full p-3">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold mt-4 font-headline">Thank you for your purchase!</CardTitle>
          <p className="text-muted-foreground">Your order has been confirmed and your downloads are ready.</p>
        </CardHeader>
        <CardContent className="space-y-6">
            <Separator />
            <div className="space-y-4">
                <h3 className="font-semibold">Your Items</h3>
                {purchase.items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="relative h-14 w-14 rounded-md overflow-hidden">
                                <Image src={product.image.url} alt={product.name} fill className="object-cover" data-ai-hint={product.image.hint} />
                            </div>
                            <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                            </div>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <a href={product.downloadUrl} download>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </a>
                        </Button>
                    </div>
                ))}
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
                <span>Total Paid</span>
                <span>${purchase.total.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="text-center">
                <Button asChild>
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
