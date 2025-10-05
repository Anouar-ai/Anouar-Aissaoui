'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    const purchaseData = localStorage.getItem('purchase');
    if (purchaseData) {
      try {
        setPurchase(JSON.parse(purchaseData));
        // Clear the item so it's not shown again on refresh
        localStorage.removeItem('purchase');
      } catch (e) {
        console.error("Failed to parse purchase data", e);
        router.push('/');
      }
    } else {
      // No purchase data, redirect to home
      router.push('/');
    }
    setIsLoading(false);
  }, [router]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your order details...</p>
        </div>
      );
    }

    if (purchase) {
      return (
        <>
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
                  {purchase.downloadUrls.map((link) => (
                    <div key={link.name} className="flex justify-between items-center p-3 bg-secondary rounded-md">
                      <p className="font-medium">{link.name}</p>
                      <Button asChild variant="outline" size="sm">
                        <a href={link.url} download>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </div>
                  ))}
                   <p className="text-xs text-muted-foreground text-center pt-2">
                        Your download links are valid for 15 minutes.
                    </p>
                </div>
            </CardContent>
        </>
      );
    }
     return null;
  };
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <Card className="max-w-2xl mx-auto">
        {renderContent()}
        <CardContent>
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
