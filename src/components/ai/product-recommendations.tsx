"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { aiProductRecommendations } from "@/ai/flows/ai-product-recommendations";
import { products } from "@/lib/products";
import type { Product } from "@/lib/types";
import { ProductCard } from "../product-card";
import { Skeleton } from "../ui/skeleton";
import { Wand2 } from "lucide-react";

export default function ProductRecommendations() {
  const { cartItems } = useCart();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (cartItems.length < 2) {
        setRecommendations([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const productNames = cartItems.map(item => item.product.name);
        const result = await aiProductRecommendations({ productNames });
        
        if (result.recommendedProducts && result.recommendedProducts.length > 0) {
            const recommendedFullProducts = result.recommendedProducts
                .map(name => products.find(p => p.name.toLowerCase() === name.toLowerCase()))
                .filter((p): p is Product => Boolean(p))
                .filter(p => !cartItems.some(item => item.product.id === p.id));
            
            setRecommendations(recommendedFullProducts.slice(0, 2));
        } else {
            setRecommendations([]);
        }

      } catch (err) {
        console.error("Failed to fetch AI recommendations:", err);
        setError("Could not load recommendations.");
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
        fetchRecommendations();
    }, 500);

    return () => clearTimeout(debounceTimer);

  }, [cartItems]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 animate-pulse text-accent" />
            <h4 className="font-semibold text-accent">Finding recommendations...</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Wand2 className="h-5 w-5 text-accent" />
        <h4 className="font-semibold text-accent">You Might Also Like</h4>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {recommendations.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
