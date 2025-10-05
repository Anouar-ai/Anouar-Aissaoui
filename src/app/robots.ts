import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
    const siteUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/checkout/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}