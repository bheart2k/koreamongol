export default function manifest() {
  return {
    name: 'KoreaMongol',
    short_name: 'KoreaMongol',
    description: 'Mongolians in Korea Guide',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1A2B4B',
    icons: [
      {
        src: '/icon',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
