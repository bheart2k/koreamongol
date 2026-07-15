import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Түргэн хариулт | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage('Түргэн хариулт', 'Нэг асуулт — нэг хариулт');
}
