/**
 * Google Analytics 커스텀 이벤트 추적 헬퍼
 *
 * @description GA4 gtag 이벤트를 쉽게 보낼 수 있는 유틸리티 함수
 *
 * @example
 * // 기본 사용
 * trackEvent('generate_name', { label: 'korean_name' });
 *
 * // 카테고리와 값 지정
 * trackEvent('complete_quiz', {
 *   category: 'learning',
 *   label: 'full_quiz',
 *   value: 24
 * });
 */

/**
 * GA4 이벤트 전송 + 자체 DB 기록
 * @param {string} eventName - 이벤트 이름 (예: 'generate_name', 'copy_phrase')
 * @param {Object} params - 추가 파라미터
 * @param {string} [params.category] - 이벤트 카테고리 (기본: 'engagement')
 * @param {string} [params.label] - 이벤트 라벨
 * @param {number} [params.value] - 이벤트 값
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;

  // GA4 이벤트 전송
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

  // 자체 DB에 기록 (백그라운드)
  trackToInternalDB(eventName, params);
}

/**
 * 자체 DB에 이벤트 기록 (비동기, 실패해도 무시)
 * sendBeacon 우선 사용 (페이지 이동 중에도 안전하게 전송)
 */
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

    // sendBeacon 사용 (페이지 이동/새 탭에서도 안정적으로 전송)
    if (navigator.sendBeacon) {
      const blob = new Blob([data], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/track', blob);
    } else {
      // fallback: fetch
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
      }).catch(() => {});
    }
  } catch {
    // 무시
  }
}

/**
 * 세션 ID 가져오기 (없으면 생성)
 */
function getSessionId() {
  if (typeof window === 'undefined') return null;

  const key = 'hh_session_id';
  let sessionId = sessionStorage.getItem(key);

  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem(key, sessionId);
  }

  return sessionId;
}

// 미리 정의된 이벤트 (자동완성 및 일관성을 위해)
export const ANALYTICS_EVENTS = {
  // 도구 사용
  GENERATE_NAME: 'generate_name',
  COPY_PHRASE: 'copy_phrase',
  DOWNLOAD_PHRASE: 'download_phrase',
  SHARE_CARD: 'share_card',
  FLIP_CARD: 'flip_card',
  DOWNLOAD_FONT: 'download_font',

  // 학습
  COMPLETE_QUIZ: 'complete_quiz',
  START_QUIZ: 'start_quiz',

  // 기타
  PLAY_AUDIO: 'play_audio',
};

// 도구별 이벤트 래퍼 함수들
export const analytics = {
  /**
   * 이름 생성 이벤트
   * @param {Object} params
   * @param {string} params.englishName - 입력한 영어 이름
   * @param {string} params.gender - 성별 (male/female/neutral)
   * @param {string} params.style - 스타일 (modern/traditional/neutral)
   * @param {number} params.count - 생성된 이름 수
   */
  generateName: (params = {}) => {
    const genderLabel = { male: '남', female: '여', neutral: '중' }[params.gender] || '';
    const styleLabel = { modern: '현대', traditional: '전통', neutral: '중립' }[params.style] || '';
    const label = params.englishName
      ? `${params.englishName} (${genderLabel}/${styleLabel})`
      : params.style || 'default';

    trackEvent(ANALYTICS_EVENTS.GENERATE_NAME, {
      ...params,
      category: 'tools',
      label,
    });
  },

  /**
   * 문구 복사 이벤트
   * @param {Object} params
   * @param {string} params.phrase - 복사된 문구
   * @param {string} params.category - 문구 카테고리
   */
  copyPhrase: (params = {}) => {
    trackEvent(ANALYTICS_EVENTS.COPY_PHRASE, {
      ...params,
      category: 'tools',
      label: params.category || 'phrase',
    });
  },

  /**
   * 문구 이미지 다운로드 이벤트
   * @param {Object} params
   * @param {string} params.platform - 플랫폼 (instagram/twitter/story)
   */
  downloadPhrase: (params = {}) => {
    trackEvent(ANALYTICS_EVENTS.DOWNLOAD_PHRASE, {
      ...params,
      category: 'tools',
      label: params.platform || 'unknown',
    });
  },

  /**
   * 카드 뒤집기 이벤트
   * @param {Object} params
   * @param {string} params.cardType - 카드 타입 (proverb/meme)
   * @param {string} params.cardId - 카드 ID
   */
  flipCard: (params = {}) => {
    trackEvent(ANALYTICS_EVENTS.FLIP_CARD, {
      ...params,
      category: 'engagement',
      label: params.cardType || 'card',
    });
  },

  /**
   * 카드 공유 이벤트
   * @param {Object} params
   * @param {string} params.cardType - 카드 타입
   * @param {string} params.platform - 공유 플랫폼
   */
  shareCard: (params = {}) => {
    trackEvent(ANALYTICS_EVENTS.SHARE_CARD, {
      ...params,
      category: 'social',
      label: params.platform || 'unknown',
    });
  },

  /**
   * 폰트 다운로드 클릭 이벤트
   * @param {Object} params
   * @param {string} params.fontId - 폰트 ID
   * @param {string} params.fontName - 폰트 이름
   */
  downloadFont: (params = {}) => {
    trackEvent(ANALYTICS_EVENTS.DOWNLOAD_FONT, {
      ...params,
      category: 'tools',
      label: params.fontId || 'unknown',
    });
  },

  /**
   * 퀴즈 시작 이벤트
   * @param {Object} params
   * @param {string} params.mode - 퀴즈 모드 (quick/full/review/kpop)
   */
  startQuiz: (params = {}) => {
    trackEvent(ANALYTICS_EVENTS.START_QUIZ, {
      ...params,
      category: 'learning',
      label: params.mode || 'unknown',
    });
  },

  /**
   * 퀴즈 완료 이벤트
   * @param {Object} params
   * @param {string} params.mode - 퀴즈 모드
   * @param {number} params.score - 점수 (정답 수)
   * @param {number} params.total - 총 문제 수
   */
  completeQuiz: (params = {}) => {
    trackEvent(ANALYTICS_EVENTS.COMPLETE_QUIZ, {
      ...params,
      category: 'learning',
      label: params.mode || 'unknown',
      value: params.score,
    });
  },

  /**
   * 오디오 재생 이벤트
   * @param {Object} params
   * @param {string} params.text - 재생된 텍스트
   */
  playAudio: (params = {}) => {
    trackEvent(ANALYTICS_EVENTS.PLAY_AUDIO, {
      ...params,
      category: 'engagement',
      label: 'tts',
    });
  },
};

export default analytics;
