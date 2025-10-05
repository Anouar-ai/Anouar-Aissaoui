'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';

function SuccessContent() {
  const [downloadLinks, setDownloadLinks] = useState<{name: string, url: string}[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = useSearchParams().get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) {
      let isMounted = true;
      (async () => {
        try {
          const res = await fetch(`/api/verify-session?session_id=${sessionId}`);
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to verify payment session.');
          }
          const data = await res.json();
          if (isMounted) {
            setDownloadLinks(data.downloadUrls);
            clearCart(); // Clear cart only after successful verification
          }
        } catch (e: any) {
          if (isMounted) {
            setError(e.message);
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      })();
      return () => {
        isMounted = false;
      }
    } else {
        setIsLoading(false);
        setError("No session ID found. Please contact support if you completed a payment.");
    }
  }, [sessionId, clearCart]);

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
          {isLoading && (
             <div className="flex flex-col items-center justify-center gap-2 p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Verifying your payment...</p>
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
          {downloadLinks.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">Your Downloads</h3>
              {downloadLinks.map((link) => (
                <div key={link.name} className="flex justify-between items-center p-3 bg-secondary rounded-md">
                  <p className="font-medium">{link.name}</p>
                  <Button asChild variant="outline" size="sm">
                    <a href={link.url}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
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
