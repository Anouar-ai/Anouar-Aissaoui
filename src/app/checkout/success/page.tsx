'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type DownloadLink = {
  name: string;
  url: string;
};

type Purchase = {
    downloadUrls: DownloadLink[];
    total: number;
}

function SuccessContent() {
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This effect runs only on the client side
    const purchaseData = localStorage.getItem('purchase');
    if (purchaseData) {
      try {
        const parsedData = JSON.parse(purchaseData);
        setPurchase(parsedData);
        // Important: Clear the item from storage so it's not shown again on refresh or revisit
        localStorage.removeItem('purchase');
      } catch (e) {
        console.error("Failed to parse purchase data from localStorage", e);
        // If data is malformed, redirect to home
        router.push('/');
      }
    } else {
      // If there's no purchase data, the user likely navigated here directly.
      // Redirect them to the homepage.
      router.push('/');
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-lg">Verifying your purchase...</p>
      </div>
    );
  }

  if (!purchase) {
    // This state is briefly hit before the redirect in useEffect completes.
    // Can also show a message if needed, but redirect is cleaner.
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="items-center text-center p-6 bg-secondary/30">
          <div className="mx-auto w-fit bg-green-100 dark:bg-green-900/50 rounded-full p-3 mb-4">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold font-headline">Thank you for your purchase!</CardTitle>
          <p className="text-muted-foreground pt-1">Your order is confirmed, and your downloads are ready.</p>
        </CardHeader>
        <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Your Downloads</h3>
              {purchase.downloadUrls.map((link) => (
                <div key={link.name} className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                  <p className="font-medium text-secondary-foreground">{link.name}</p>
                  <Button asChild>
                    <a href={link.url} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
            <Separator className="my-6" />
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Order Summary</h3>
                <div className="flex justify-between text-muted-foreground">
                    <span>Total Amount Paid</span>
                    <span className="font-bold text-foreground">${purchase.total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground text-center pt-4">
                    Your download links are valid for 15 minutes. A confirmation has been sent to your email.
                </p>
            </div>
        </CardContent>
        <CardFooter className="bg-secondary/30 p-6 flex-col items-center justify-center gap-4">
            <Button asChild className="w-full md:w-auto">
              <Link href="/">Continue Shopping</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
    // Using Suspense is good practice for pages that use client-side data fetching or search params
    return (
        <Suspense>
            <SuccessContent />
        </Suspense>
    )
}
