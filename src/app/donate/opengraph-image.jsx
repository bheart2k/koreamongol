import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Дэмжлэг | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage('Дэмжлэг', 'Сайтын тогтвортой үйл ажиллагааг дэмжээрэй');
}
