import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Визний гарын авлага | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage('Визний гарын авлага', 'E-9, D-2, D-4 визний мэдээлэл');
}
