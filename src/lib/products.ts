import type { Product } from '@/lib/types';
import { getImageById } from '@/lib/placeholder-images';

export const products: Product[] = [
  {
    id: 1,
    name: 'Modern Chair',
    slug: 'modern-chair',
    description: 'Experience comfort and style with this modern chair. Its minimalist design and ergonomic shape make it a perfect addition to any contemporary living space or office. Upholstered with high-quality fabric for a soft touch.',
    price: 180.00,
    image: {
      id: 'modern-chair',
      url: getImageById('modern-chair')?.imageUrl || '',
      hint: getImageById('modern-chair')?.imageHint || '',
    },
  },
  {
    id: 2,
    name: 'Wooden Desk',
    slug: 'wooden-desk',
    description: 'A sturdy and spacious wooden desk, perfect for your home office. Made from solid oak, it provides a durable and beautiful surface for work or study. Features two drawers for storage.',
    price: 350.00,
    image: {
      id: 'wooden-desk',
      url: getImageById('wooden-desk')?.imageUrl || '',
      hint: getImageById('wooden-desk')?.imageHint || '',
    },
  },
  {
    id: 3,
    name: 'Floor Lamp',
    slug: 'floor-lamp',
    description: 'Illuminate your room with this sleek industrial floor lamp. Its adjustable head allows you to direct light where you need it most. The matte black finish adds a touch of modern sophistication.',
    price: 120.00,
    image: {
      id: 'floor-lamp',
      url: getImageById('floor-lamp')?.imageUrl || '',
      hint: getImageById('floor-lamp')?.imageHint || '',
    },
  },
  {
    id: 4,
    name: 'Plush Sofa',
    slug: 'plush-sofa',
    description: 'Sink into the deep, comfortable cushions of our plush sofa. This three-seater is perfect for family movie nights or relaxing with a good book. Upholstered in a durable yet soft fabric.',
    price: 850.00,
    image: {
      id: 'plush-sofa',
      url: getImageById('plush-sofa')?.imageUrl || '',
      hint: getImageById('plush-sofa')?.imageHint || '',
    },
  },
  {
    id: 5,
    name: 'Coffee Table',
    slug: 'coffee-table',
    description: 'This sleek coffee table features a tempered glass top and a minimalist chrome frame. It\'s a stunning centerpiece for any living room, offering both style and functionality.',
    price: 220.00,
    image: {
      id: 'coffee-table',
      url: getImageById('coffee-table')?.imageUrl || '',
      hint: getImageById('coffee-table')?.imageHint || '',
    },
  },
  {
    id: 6,
    name: 'Bookshelf',
    slug: 'bookshelf',
    description: 'Organize your favorite reads with this tall wooden bookshelf. With five spacious shelves, it provides ample storage for books, decor, and more. A timeless piece for any room.',
    price: 280.00,
    image: {
      id: 'bookshelf',
      url: getImageById('bookshelf')?.imageUrl || '',
      hint: getImageById('bookshelf')?.imageHint || '',
    },
  },
  {
    id: 7,
    name: 'Designer Vase',
    slug: 'designer-vase',
    description: 'Add an artistic touch to your home with this beautiful ceramic vase. Its unique shape and textured finish make it a statement piece, with or without flowers.',
    price: 75.00,
    image: {
      id: 'designer-vase',
      url: getImageById('designer-vase')?.imageUrl || '',
      hint: getImageById('designer-vase')?.imageHint || '',
    },
  },
  {
    id: 8,
    name: 'Abstract Art Print',
    slug: 'art-print',
    description: 'Elevate your wall decor with this captivating abstract art print. The vibrant colors and dynamic composition will add energy and style to any room. Comes in a sleek black frame.',
    price: 150.00,
    image: {
      id: 'art-print',
      url: getImageById('art-print')?.imageUrl || '',
      hint: getImageById('art-print')?.imageHint || '',
    },
  },
];
