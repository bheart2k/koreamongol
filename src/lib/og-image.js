import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

/**
 * 페이지별 OG 이미지 생성 공통 함수
 * @param {string} title — 페이지 제목 (몽골어)
 * @param {string} [subtitle] — 부제목 (선택)
 */
export function generateOGImage(title, subtitle) {
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
          gap: '20px',
          background: 'linear-gradient(135deg, #E8F0FE 0%, #FAF6F0 100%)',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* 로고 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '48px',
            fontWeight: 800,
            letterSpacing: '-1px',
          }}
        >
          <span style={{ color: '#1B2D4F' }}>Korea</span>
          <span style={{ color: '#D4A843' }}>Mongol</span>
        </div>

        {/* 페이지 제목 */}
        <p
          style={{
            fontSize: '44px',
            fontWeight: 700,
            color: '#1B2D4F',
            textAlign: 'center',
            lineHeight: 1.3,
            maxWidth: '900px',
          }}
        >
          {title}
        </p>

        {/* 부제목 */}
        {subtitle && (
          <p
            style={{
              fontSize: '24px',
              color: '#6B7280',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            {subtitle}
          </p>
        )}

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
    { ...ogSize }
  );
}
