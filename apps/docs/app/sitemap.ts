import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://docs.melony.dev';
  
  // Add your documentation routes here
  const routes = [
    '',
    '/docs',
    '/docs/getting-started',
    '/docs/components',
    '/docs/api',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
} 