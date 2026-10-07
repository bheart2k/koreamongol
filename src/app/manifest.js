export default function manifest() {
  return {
    name: 'KoreaMongol — Солонгост амьдрах гарын авлага',
    short_name: 'KoreaMongol',
    description: 'Монгол иргэдэд зориулсан Солонгос амьдралын бүрэн гарын авлага.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1B2D4F',
    icons: [
      {
        src: '/icon.svg',
        sizes: '32x32',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
