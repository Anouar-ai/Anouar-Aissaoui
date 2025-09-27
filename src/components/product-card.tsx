import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { AddToCartButton } from "./add-to-cart-button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-xl">
      <CardHeader className="border-b p-0">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-square w-full">
            <Image
              src={product.images[0]?.src || '/placeholder.jpg'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.slug}`} className="block flex-1">
          <h3 className="font-semibold">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between pt-4">
          <p className="text-lg font-bold">${product.price}</p>
          <AddToCartButton product={product} variant="icon" />
        </div>
      </CardContent>
    </Card>
  );
}
