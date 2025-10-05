import type { Product } from '@/types';
import { PlaceHolderImages } from './placeholder-images';

const getPlaceholderImage = (id: string) => {
    const image = PlaceHolderImages.find(p => p.id === id);
    if (!image) {
        return { id: 'default', url: 'https://picsum.photos/seed/default/600/400', hint: 'digital product' };
    }
    return { id: image.id, url: image.imageUrl, hint: image.imageHint };
}

export const products: Product[] = [
  {
    id: 'elementor-pro',
    name: 'Elementor Pro',
    category: 'Website Builder',
    description: 'Official Website Builder License with 1 Year of Updates.',
    longDescription: 'Elementor Pro is the industry-leading website builder for WordPress. Create stunning, professional websites with an intuitive drag-and-drop interface. This license includes one year of premium updates, support, and access to all Pro widgets and templates.',
    price: 49.99,
    image: getPlaceholderImage('elementor-pro'),
    reviews: 1258,
    rating: 4.9,
    downloadUrl: '#',
  },
  {
    id: 'generatepress-premium',
    name: 'GeneratePress Premium',
    category: 'WordPress Theme',
    description: 'Official License Key for the #1 lightweight theme, including 1 Year of Updates.',
    longDescription: 'Unlock the full potential of the GeneratePress theme. GP Premium gives you access to the Site Library, more colors, typography, elements, and much more. It’s the perfect foundation for any WordPress project, prioritizing speed and usability.',
    price: 59.00,
    image: getPlaceholderImage('generatepress-premium'),
    reviews: 972,
    rating: 5.0,
    downloadUrl: '#',
  },
  {
    id: 'generateblocks-pro',
    name: 'GenerateBlocks Pro',
    category: 'Block Editor',
    description: 'Official License Key for the powerful block editor extension, with 1 Year of Updates.',
    longDescription: 'Take your block editing experience to the next level. GenerateBlocks Pro adds a powerful set of tools to the WordPress editor, including an Asset Library, Global Styles, advanced controls, and professional patterns to build anything you can imagine.',
    price: 39.00,
    image: getPlaceholderImage('generateblocks-pro'),
    reviews: 450,
    rating: 4.8,
    downloadUrl: '#',
  },
  {
    id: 'rank-math-pro',
    name: 'Rank Math Pro',
    category: 'SEO Plugin',
    description: 'Official SEO Plugin License with 1 Year of Updates.',
    longDescription: 'Rank Math Pro is the Swiss army knife of WordPress SEO. It comes with everything you need to take control of your on-page SEO. Features include advanced schema generation, keyword tracking, Google Analytics 4 integration, and much more.',
    price: 59.99,
    image: getPlaceholderImage('rank-math-pro'),
    reviews: 2340,
    rating: 4.9,
    downloadUrl: '#',
  },
  {
    id: 'wp-rocket-premium',
    name: 'WP Rocket Premium',
    category: 'Caching Plugin',
    description: 'Official Caching Plugin License with 1 Year of Updates.',
    longDescription: 'Make your WordPress site blazing fast in just a few clicks. WP Rocket is recognized as the most powerful caching plugin by WordPress experts. It provides page caching, cache preloading, GZIP compression, and lazy loading for images.',
    price: 59.00,
    image: getPlaceholderImage('wp-rocket-premium'),
    reviews: 3105,
    rating: 4.9,
    downloadUrl: '#',
  },
];
