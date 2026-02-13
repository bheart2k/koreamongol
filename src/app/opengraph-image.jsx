import { ImageResponse } from 'next/og';

export const alt = 'KoreaMongol — Солонгост амьдрах гарын авлага';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          background: 'linear-gradient(135deg, #E8F0FE 0%, #FAF6F0 100%)',
          position: 'relative',
        }}
      >
        {/* 로고 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '72px',
            fontWeight: 800,
            letterSpacing: '-1px',
          }}
        >
          <span style={{ color: '#1B2D4F' }}>Korea</span>
          <span style={{ color: '#D4A843' }}>Mongol</span>
        </div>

        {/* 태그라인 */}
        <p
          style={{
            fontSize: '28px',
            color: '#6B7280',
          }}
        >
          Солонгост амьдрах гарын авлага
        </p>

        {/* Flags */}
        <p style={{ fontSize: '48px' }}>🇰🇷 🇲🇳</p>

        {/* URL */}
        <span
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '32px',
            fontSize: '18px',
            color: '#1B2D4F',
            fontWeight: 500,
          }}
        >
          koreamongol.com
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
