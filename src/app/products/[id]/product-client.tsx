'use client'
import { useState } from 'react';
import Image from 'next/image';
import { Star, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { BuyNowButton } from '@/components/buy-now-button';
import type { Product } from '@/types';
import React from 'react';

export default function ProductClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.longDescription,
    image: product.image.url,
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
  };
  
  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
      <Card className="overflow-hidden bg-secondary/30 border-none">
        <CardContent className="p-0">
          <div className="aspect-video relative">
            <Image
              src={product.image.url}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              data-ai-hint={product.image.hint}
              priority
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col">
        <Badge variant="outline" className="w-fit mb-2 border-primary/50 text-primary">{product.category}</Badge>
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
          <Button size="lg" onClick={handleAddToCart} variant="outline" className="flex-1">
            Add to Cart
          </Button>
        </div>
        <BuyNowButton productId={product.id} quantity={quantity} />
        
        <div className="border-t border-border/50 pt-6 mt-6">
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
    </>
  )
}
