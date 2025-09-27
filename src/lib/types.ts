export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: {
    id: string;
    url: string;
    hint: string;
  };
  categories: { id: number; name: string; slug: string }[];
  images: { id: number; src: string; alt: string }[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};
