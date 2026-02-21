/**
 * KoreaMongol GA4 커스텀 이벤트 추적
 */

/**
 * GA4 이벤트 전송 + 자체 DB 기록
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    try {
      window.gtag('event', eventName, {
        event_category: params.category || 'engagement',
        event_label: params.label || '',
        value: params.value ?? 1,
        ...params,
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Analytics] GA4 tracking failed:', error);
      }
    }
  }

  trackToInternalDB(eventName, params);
}

function trackToInternalDB(eventName, params = {}) {
  try {
    const data = JSON.stringify({
      event: eventName,
      category: params.category || 'engagement',
      label: params.label || '',
      value: params.value ?? 1,
      metadata: params,
      sessionId: getSessionId(),
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([data], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/track', blob);
    } else {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
      }).catch(() => {});
    }
  } catch {
    // ignore
  }
}

function getSessionId() {
  if (typeof window === 'undefined') return null;
  const key = 'km_session_id';
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

// KoreaMongol 이벤트 정의
export const ANALYTICS_EVENTS = {
  // 가이드
  GUIDE_VIEW: 'guide_view',
  EMERGENCY_CALL: 'emergency_call',
  EXTERNAL_LINK: 'external_link',

  // 공유
  SHARE_FACEBOOK: 'share_facebook',
  SHARE_COPY_LINK: 'share_copy_link',

  // 도구
  EXCHANGE_CALCULATE: 'exchange_calculate',
  SEVERANCE_CALCULATE: 'severance_calculate',

  // 커뮤니티
  COMMUNITY_POST: 'community_post',
  COMMUNITY_COMMENT: 'community_comment',

  // 후원
  DONATE_CLICK: 'donate_click',
};

export const analytics = {
  /** 가이드 페이지 조회 */
  guideView: (guideId) => {
    trackEvent(ANALYTICS_EVENTS.GUIDE_VIEW, {
      category: 'guide',
      label: guideId,
    });
  },

  /** 긴급 전화번호 클릭 */
  emergencyCall: (number) => {
    trackEvent(ANALYTICS_EVENTS.EMERGENCY_CALL, {
      category: 'guide',
      label: number,
    });
  },

  /** 외부 링크 클릭 */
  externalLink: (url) => {
    trackEvent(ANALYTICS_EVENTS.EXTERNAL_LINK, {
      category: 'guide',
      label: url,
    });
  },

  /** Facebook 공유 */
  shareFacebook: (pageUrl) => {
    trackEvent(ANALYTICS_EVENTS.SHARE_FACEBOOK, {
      category: 'social',
      label: pageUrl,
    });
  },

  /** 링크 복사 */
  shareCopyLink: (pageUrl) => {
    trackEvent(ANALYTICS_EVENTS.SHARE_COPY_LINK, {
      category: 'social',
      label: pageUrl,
    });
  },

  /** 환율 계산 */
  exchangeCalculate: (direction) => {
    trackEvent(ANALYTICS_EVENTS.EXCHANGE_CALCULATE, {
      category: 'tools',
      label: direction,
    });
  },

  /** 퇴직금 계산 */
  severanceCalculate: () => {
    trackEvent(ANALYTICS_EVENTS.SEVERANCE_CALCULATE, {
      category: 'tools',
    });
  },

  /** 커뮤니티 글 작성 */
  communityPost: (boardType) => {
    trackEvent(ANALYTICS_EVENTS.COMMUNITY_POST, {
      category: 'community',
      label: boardType,
    });
  },

  /** 커뮤니티 댓글 */
  communityComment: (boardType) => {
    trackEvent(ANALYTICS_EVENTS.COMMUNITY_COMMENT, {
      category: 'community',
      label: boardType,
    });
  },

  /** 후원 클릭 */
  donateClick: (source) => {
    trackEvent(ANALYTICS_EVENTS.DONATE_CLICK, {
      category: 'engagement',
      label: source, // 'banner', 'page', 'footer'
    });
  },
};

export default analytics;
