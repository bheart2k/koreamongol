import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Ханш тооцоолуур | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage('Ханш тооцоолуур', 'KRW ↔ MNT хөрвүүлэг');
}
