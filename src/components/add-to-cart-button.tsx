"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
    product: Product;
    variant?: 'icon' | 'full';
}

export function AddToCartButton({ product, variant = 'full' }: AddToCartButtonProps) {
    const { addToCart } = useCart();

    const productToAdd = {
        ...product,
        price: Number(product.price)
    }

    if (variant === 'icon') {
        return (
            <Button size="icon" variant="outline" onClick={() => addToCart(productToAdd)}>
                <ShoppingCart className="h-4 w-4" />
                <span className="sr-only">Add to cart</span>
            </Button>
        )
    }

    return (
        <Button onClick={() => addToCart(productToAdd)} size="lg" className="w-full sm:w-auto">
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to cart
        </Button>
    )
}
