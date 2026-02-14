import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Тээврийн гарын авлага | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage('Тээврийн гарын авлага', 'Метро, автобус, такси, KTX');
}
