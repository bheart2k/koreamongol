const BASE_URL = 'https://koreamongol.com';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/mypage/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
