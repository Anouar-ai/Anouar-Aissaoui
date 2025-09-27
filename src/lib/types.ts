export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: { id: number; src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};
