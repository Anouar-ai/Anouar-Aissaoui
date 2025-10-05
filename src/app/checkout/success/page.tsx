'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CartItem } from '@/types';

type Purchase = {
    items: CartItem[];
    total: number;
}

function SuccessContent() {
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const purchaseData = localStorage.getItem('purchase');
    
    if (purchaseData) {
        setPurchase(JSON.parse(purchaseData));
        localStorage.removeItem('purchase'); // Clear after reading
    } else {
        // If no purchase data, redirect to home
        router.replace('/');
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 p-8 min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your order details...</p>
        </div>
    )
  }

  if (error) {
      return (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
            <p><strong>Error:</strong> {error}</p>
          </div>
      )
  }
  
  if (!purchase) {
      // This state is temporary while redirecting
      return (
        <div className="flex flex-col items-center justify-center gap-2 p-8 min-h-[50vh]">
            <p className="text-muted-foreground">No purchase data found. Redirecting...</p>
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
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">Your Downloads</h3>
              {purchase.items.map(({ product }) => (
                <div key={product.id} className="flex justify-between items-center p-3 bg-secondary rounded-md">
                  <p className="font-medium">{product.name}</p>
                  <Button asChild variant="outline" size="sm">
                    <a href={product.downloadUrl}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          <div className="text-center pt-4 border-t">
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="text-center p-16">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}
