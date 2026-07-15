/**
 * DB 상수 정의 - 포인트, 레벨, 배지, 피드백 등
 */

// 포인트 설정
export const POINT_CONFIG = {
  login: { points: 10, daily: true, description: '출석 체크' },
  signup: { points: 100, once: true, description: '회원가입 보너스' },
  post: { points: 20, daily: false, description: '게시글 작성' },
  comment: { points: 5, daily: false, description: '댓글 작성' },
  like_received: { points: 2, daily: false, description: '좋아요 받음' },
  level_up: { points: 50, description: '레벨업 보너스' },
  badge: { points: 30, description: '배지 획득' },
  learn: { points: 5, daily: false, description: '한글 학습 완료' },
  name_generate: { points: 2, daily: false, dailyLimit: 10, description: '이름 생성' },
  share: { points: 5, daily: false, dailyLimit: 5, description: '결과 공유' },
  admin: { points: 0, description: '관리자 지급' },
};

// 레벨 설정
export const LEVEL_CONFIG = [
  { level: 1, requiredPoints: 0, title: '한글 새싹' },
  { level: 2, requiredPoints: 100, title: '한글 학생' },
  { level: 3, requiredPoints: 300, title: '한글 탐험가' },
  { level: 4, requiredPoints: 600, title: '한글 애호가' },
  { level: 5, requiredPoints: 1000, title: '한글 달인' },
  { level: 6, requiredPoints: 1500, title: '한글 장인' },
  { level: 7, requiredPoints: 2500, title: '한글 명인' },
  { level: 8, requiredPoints: 4000, title: '한글 대가' },
  { level: 9, requiredPoints: 6000, title: '한글 현자' },
  { level: 10, requiredPoints: 10000, title: '세종대왕' },
];

// 기본 배지 정의
export const DEFAULT_BADGES = [
  { code: 'first_login', name: '첫 발걸음', description: '첫 출석 체크', icon: '👣', category: 'activity', condition: { type: 'login_days', count: 1 }, rarity: 'common' },
  { code: 'login_7', name: '일주일 연속', description: '7일 연속 출석', icon: '📅', category: 'special', condition: { type: 'login_streak', count: 7 }, rarity: 'uncommon' },
  { code: 'first_post', name: '첫 글', description: '첫 게시글 작성', icon: '✍️', category: 'activity', condition: { type: 'posts', count: 1 }, rarity: 'common' },
  { code: 'first_comment', name: '첫 댓글', description: '첫 댓글 작성', icon: '💬', category: 'activity', condition: { type: 'comments', count: 1 }, rarity: 'common' },
  { code: 'first_consonant', name: '첫 자음', description: '첫 자음 학습 완료', icon: 'ㄱ', category: 'learning', condition: { type: 'lessons', count: 1 }, rarity: 'common' },
  { code: 'all_consonants', name: '자음 마스터', description: '자음 14개 완료', icon: '🔤', category: 'learning', condition: { type: 'consonants_complete', count: 14 }, rarity: 'rare' },
  { code: 'all_vowels', name: '모음 마스터', description: '모음 10개 완료', icon: '🔠', category: 'learning', condition: { type: 'vowels_complete', count: 10 }, rarity: 'rare' },
  { code: 'hangul_master', name: '한글 마스터', description: '전체 학습 완료', icon: '🏆', category: 'learning', condition: { type: 'all_complete', count: 1 }, rarity: 'epic' },
  { code: 'first_name', name: '이름 탄생', description: '첫 이름 생성', icon: '👶', category: 'community', condition: { type: 'names_generated', count: 1 }, rarity: 'common' },
  { code: 'name_10', name: '이름 수집가', description: '이름 10개 생성', icon: '📝', category: 'community', condition: { type: 'names_generated', count: 10 }, rarity: 'uncommon' },
  { code: 'name_100', name: '이름 마니아', description: '이름 100개 생성', icon: '📚', category: 'community', condition: { type: 'names_generated', count: 100 }, rarity: 'rare' },
  { code: 'share_first', name: '공유의 시작', description: '첫 SNS 공유', icon: '🤝', category: 'community', condition: { type: 'shares', count: 1 }, rarity: 'common' },
  { code: 'post_10', name: '활발한 작가', description: '게시글 10개 작성', icon: '📝', category: 'activity', condition: { type: 'posts', count: 10 }, rarity: 'uncommon' },
  { code: 'comment_50', name: '소통왕', description: '댓글 50개 작성', icon: '🗣️', category: 'activity', condition: { type: 'comments', count: 50 }, rarity: 'uncommon' },
  { code: 'popular_post', name: '인기 작가', description: '좋아요 10개 받은 글', icon: '⭐', category: 'activity', condition: { type: 'post_likes', count: 10 }, rarity: 'rare' },
  { code: 'login_30', name: '한 달 연속', description: '30일 연속 출석', icon: '🗓️', category: 'special', condition: { type: 'login_streak', count: 30 }, rarity: 'rare' },
  { code: 'level_5', name: '한글 달인', description: '레벨 5 달성', icon: '🎖️', category: 'level', condition: { type: 'level', count: 5 }, rarity: 'uncommon' },
  { code: 'level_10', name: '세종대왕', description: '레벨 10 달성', icon: '👑', category: 'level', condition: { type: 'level', count: 10 }, rarity: 'legendary' },
];

// Inbox 타입
export const INBOX_TYPES = {
  inquiry: { label: '문의', labelMn: 'Асуулт' },
  report: { label: '제보', labelMn: 'Мэдэгдэл' },
  question: { label: '정보 질문', labelMn: 'Мэдээллийн асуулт' },
};

// 피드백 유형
export const FEEDBACK_CATEGORIES = {
  opinion: { label: '의견', labelMn: 'Сэтгэгдэл' },
  bug: { label: '버그 신고', labelMn: 'Алдаа мэдэгдэх' },
  improvement: { label: '개선 제안', labelMn: 'Сайжруулах санал' },
};

// Inbox 카테고리 (inquiry 하위)
export const INBOX_CATEGORIES = {
  general: { label: '일반 문의', labelMn: 'Ерөнхий асуулт' },
  improvement: { label: '개선 제안', labelMn: 'Сайжруулалт' },
  bug: { label: '버그 신고', labelMn: 'Алдаа мэдэгдэх' },
  other: { label: '기타', labelMn: 'Бусад' },
};

// Inbox 상태
export const INBOX_STATUSES = {
  pending: { label: '대기', color: 'text-gray-600 bg-gray-100' },
  reviewing: { label: '검토 중', color: 'text-blue-600 bg-blue-100' },
  resolved: { label: '해결', color: 'text-green-600 bg-green-100' },
  deleted: { label: '휴지통', color: 'text-red-600 bg-red-100' },
};

// Inbox 우선순위
export const INBOX_PRIORITIES = {
  low: { label: '낮음', color: 'text-gray-600 bg-gray-100' },
  medium: { label: '보통', color: 'text-yellow-600 bg-yellow-100' },
  high: { label: '높음', color: 'text-red-600 bg-red-100' },
};
