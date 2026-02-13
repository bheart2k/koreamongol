'use client';

import { useEffect, useRef, useState } from 'react';

const ADSENSE_CLIENT_ID = "ca-pub-7571085132022152";
const AD_SLOT_ID = "8766318120";

// 개발 환경에서는 플레이스홀더 표시, 프로덕션에서는 실제 광고
const IS_DEV = process.env.NODE_ENV === 'development';
const SHOW_DEV_PLACEHOLDER = IS_DEV;

// AdSense 스크립트 로드 상태 (전역)
let adsenseScriptLoaded = false;
let adsenseScriptLoading = false;

/**
 * AdSense 스크립트를 동적으로 로드
 */
function loadAdsenseScript() {
  return new Promise((resolve, reject) => {
    if (adsenseScriptLoaded) {
      resolve();
      return;
    }

    if (adsenseScriptLoading) {
      // 이미 로딩 중이면 기다림
      const checkInterval = setInterval(() => {
        if (adsenseScriptLoaded) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      return;
    }

    adsenseScriptLoading = true;

    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      adsenseScriptLoaded = true;
      adsenseScriptLoading = false;
      resolve();
    };

    script.onerror = (error) => {
      adsenseScriptLoading = false;
      reject(error);
    };

    document.head.appendChild(script);
  });
}

/**
 * 개발용 광고 플레이스홀더
 */
function DevAdPlaceholder() {
  return (
    <div
      className="w-full relative overflow-hidden rounded-xl"
      style={{ minHeight: '150px' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/30 via-transparent to-cyan-400/30" />

      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)`,
        backgroundSize: '10px 10px'
      }} />

      <div className="relative h-full flex flex-col items-center justify-center gap-3 p-6 text-white">
        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-black text-sm">Ad</span>
          </div>
          <span className="font-bold text-lg tracking-wide">ADVERTISEMENT</span>
        </div>

        <div className="text-center mt-2">
          <p className="text-2xl font-black drop-shadow-lg">
            🔥 지금 바로 클릭하세요! 🔥
          </p>
          <p className="text-sm mt-1 opacity-90">
            믿을 수 없는 특가! 오늘만 99% 할인!
          </p>
        </div>

        <div className="mt-2 px-6 py-2 bg-yellow-400 text-black font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
          ✨ FREE DOWNLOAD ✨
        </div>

        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <span className="text-[10px] bg-black/30 px-3 py-1 rounded-full">
            DEV MODE • AdSense Display • 배포 시 실제 광고
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * 구글 애드센스 배너 컴포넌트
 */
export default function AdBanner({ className = '' }) {
  const adRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 광고 초기화
  useEffect(() => {
    if (SHOW_DEV_PLACEHOLDER) return;
    if (!isMounted) return;

    const initAd = async () => {
      try {
        await loadAdsenseScript();

        // 스크립트 로드 후 약간의 지연
        setTimeout(() => {
          if (adRef.current && !adRef.current.getAttribute('data-adsbygoogle-status')) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        }, 100);
      } catch (error) {
        console.error('AdSense script load error:', error);
      }
    };

    initAd();
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  if (SHOW_DEV_PLACEHOLDER) {
    return (
      <div className={`ad-banner ${className}`}>
        <DevAdPlaceholder />
      </div>
    );
  }

  return (
    <div className={`ad-banner rounded-xl overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={AD_SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
