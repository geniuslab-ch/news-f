import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://fitbuddy.ch';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/dashboard-admin/', '/dashboard-coach/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
