'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    const verifyPurchase = async (sessionId: string) => {
      try {
        const res = await fetch('/api/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to verify purchase.');
        }

        const data = await res.json();
        setPurchase(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (sessionId) {
        verifyPurchase(sessionId);
    }
    else {
      // If there's no session ID, we can't verify anything.
      setError("No purchase session found.");
      setIsLoading(false);
      // Optional: redirect after a delay
      // setTimeout(() => router.push('/'), 3000);
    }

  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-lg">Verifying your purchase...</p>
      </div>
    );
  }
  
  if (error) {
     return (
      <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="max-w-md mx-auto w-full bg-secondary/30 border-destructive/50">
            <CardHeader>
                <CardTitle className='text-destructive'>Verification Failed</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{error}</p>
                <p className="text-muted-foreground mt-2">If you have already paid, please contact support.</p>
            </CardContent>
            <CardFooter>
                 <Button asChild className="w-full">
                    <Link href="/">Return to Homepage</Link>
                </Button>
            </CardFooter>
        </Card>
      </div>
    );
  }

  if (!purchase) {
    return null; // Should be handled by error state
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <Card className="max-w-2xl mx-auto shadow-lg bg-slate-950/50 border-slate-800">
        <CardHeader className="items-center text-center p-6 bg-slate-900/50">
          <div className="mx-auto w-fit bg-green-100 dark:bg-green-900/50 rounded-full p-3 mb-4">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold font-headline text-white">Thank you for your purchase!</CardTitle>
          <p className="text-slate-400 pt-1">Your order is confirmed, and your downloads are ready.</p>
        </CardHeader>
        <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-white">Your Downloads</h3>
              {purchase.downloadUrls.map((link) => (
                <div key={link.name} className="flex justify-between items-center p-4 bg-slate-800/70 rounded-lg">
                  <p className="font-medium text-slate-200">{link.name}</p>
                  <Button asChild>
                    <a href={link.url} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
            <Separator className="my-6 bg-slate-800" />
            <div className="space-y-2">
                <h3 className="font-semibold text-lg text-white">Order Summary</h3>
                <div className="flex justify-between text-slate-400">
                    <span>Total Amount Paid</span>
                    <span className="font-bold text-white">${purchase.total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-slate-500 text-center pt-4">
                    Your download links are valid for 15 minutes. A confirmation has not been sent as this is a demo.
                </p>
            </div>
        </CardContent>
        <CardFooter className="bg-slate-900/50 p-6 flex-col items-center justify-center gap-4">
            <Button asChild className="w-full md:w-auto">
              <Link href="/">Continue Shopping</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
          <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground text-lg">Loading purchase details...</p>
          </div>
        }>
            <SuccessContent />
        </Suspense>
    )
}
