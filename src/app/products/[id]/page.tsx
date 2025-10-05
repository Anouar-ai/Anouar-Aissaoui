'use client'
import { useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, Plus, Minus } from 'lucide-react';
import { products } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video">
              <Image
                src={product.image.url}
                alt={product.name}
                width={800}
                height={450}
                className="object-cover w-full h-full"
                data-ai-hint={product.image.hint}
                priority
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col">
          <Badge variant="outline" className="w-fit mb-2">{product.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 font-headline">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>
          <p className="text-3xl font-bold text-primary mb-6">${product.price.toFixed(2)}</p>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {product.longDescription}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center text-lg font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setQuantity(q => q + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" onClick={handleAddToCart} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
              Add to Cart
            </Button>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">License Details:</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>1 Year of Official Updates</li>
              <li>1 Year of Premium Support</li>
              <li>Use on a single website</li>
              <li>100% Genuine and Secure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
