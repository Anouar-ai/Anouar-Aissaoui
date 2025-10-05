"use client"
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Star, Zap, LifeBuoy } from 'lucide-react';
import { products } from '@/lib/products';
import { reviews } from '@/lib/reviews';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCart } from '@/hooks/use-cart';

function ProductCard({ product }: { product: typeof products[0] }) {
  const { addItem } = useCart();
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block">
          <div className="aspect-video overflow-hidden">
            <Image
              src={product.image.url}
              alt={product.name}
              width={600}
              height={338}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={product.image.hint}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <Badge variant="outline" className="mb-2">{product.category}</Badge>
        <CardTitle className="text-xl font-bold mb-2 leading-tight">
          <Link href={`/products/${product.id}`} className="hover:text-primary">
            {product.name}
          </Link>
        </CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
        <div className="flex items-center mt-4">
          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-2">({product.reviews} reviews)</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <p className="text-2xl font-bold text-primary">${product.price}</p>
        <Button onClick={() => addItem(product)}>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}


export default function Home() {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-accent" />,
      title: 'Instant Delivery',
      description: 'Get your license keys and download links immediately after purchase.',
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-accent" />,
      title: 'Official Licenses',
      description: 'All products are 100% genuine with 1 year of official updates.',
    },
    {
      icon: <LifeBuoy className="h-8 w-8 text-accent" />,
      title: 'Premium Support',
      description: 'Access to our expert support team to help you with any issues.',
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="bg-white dark:bg-gray-900/50 py-20 sm:py-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary font-headline">
            Supercharge Your Website Today
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            Get official licenses for the best digital products with instant delivery and premium support.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="#products">
                Browse Products <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center items-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="py-16 sm:py-24 bg-white dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">Our Products</h2>
            <p className="mt-3 max-w-xl mx-auto text-lg text-muted-foreground">
              Hand-picked, premium tools to build and grow your online presence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
