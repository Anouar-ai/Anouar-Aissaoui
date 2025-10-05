import type { MetadataRoute } from 'next'
import { products } from '@/lib/products';
import { slugify } from '@/lib/utils';
 
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  const staticPages = [
    {
      url: siteUrl,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/#products`,
      lastModified: new Date(),
    }
  ];

  const productPages = products.map((product) => ({
    url: `${siteUrl}/products/${product.id}`,
    lastModified: new Date(),
  }));

  const categoryPages = [...new Set(products.map(p => p.category))].map((category) => ({
    url: `${siteUrl}/category/${slugify(category)}`,
    lastModified: new Date(),
  }));


  return [
    ...staticPages,
    ...productPages,
    ...categoryPages
  ];
}