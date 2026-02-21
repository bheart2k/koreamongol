import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Хэрэгтэй апп & хэрэгсэл | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage('Хэрэгтэй апп & хэрэгсэл', 'KakaoTalk, Coupang, KakaoMap, тооцоолуурууд');
}
