'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';

type DownloadLink = {
  name: string;
  url: string;
};

function SuccessContent() {
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      const verifySession = async () => {
        try {
          const res = await fetch(`/api/verify-session?session_id=${sessionId}`);
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to verify session.');
          }
          const data = await res.json();
          if (data.downloadUrls) {
            setDownloadLinks(data.downloadUrls);
            clearCart(); // Clear cart only after successful verification
          } else {
            throw new Error('No download URLs found.');
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      verifySession();
    } else {
        // No session ID in URL
        setError("No payment session ID found. Your payment may not have completed.");
        setIsLoading(false);
    }
  }, [sessionId, clearCart]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      );
    }

    if (error) {
      return (
         <CardContent>
          <div className="text-center">
            <div className="mx-auto w-fit bg-red-100 dark:bg-red-900/50 rounded-full p-3">
              <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold mt-4 font-headline">Payment Verification Failed</CardTitle>
            <CardDescription className="text-destructive mt-2">{error}</CardDescription>
          </div>
         </CardContent>
      );
    }

    if (downloadLinks) {
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
                  {downloadLinks.map((link) => (
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
        <Suspense fallback={<div className="text-center p-16">Loading payment details...</div>}>
            <SuccessContent />
        </Suspense>
    )
}
