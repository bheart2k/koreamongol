import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Тухай | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage('Тухай', 'Солонгос ба Монголын хоорондын гүүр');
}
