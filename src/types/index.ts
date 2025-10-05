export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  price: number;
  image: {
    id: string;
    url: string;
    hint: string;
  };
  reviews: number;
  rating: number;
  downloadUrl: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
    id: string;
    date: string;
    status: 'Delivered' | 'Pending' | 'Canceled';
    total: number;
    items: {
        productName: string;
        licenseKey: string;
    }[];
};
