export function formatDuration(seconds) {
  if (!seconds || seconds === 0) return '0초';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) return `${secs}초`;
  return `${mins}분 ${secs}초`;
}

export function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}

export function formatPercent(value) {
  if (value === undefined || value === null) return '0%';
  return `${(value * 100).toFixed(1)}%`;
}

export function formatDate(dateStr) {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  return `${dateStr.slice(4, 6)}/${dateStr.slice(6, 8)}`;
}

export const COUNTRY_NAMES = {
  'South Korea': '대한민국',
  'United States': '미국',
  'Japan': '일본',
  'China': '중국',
  'United Kingdom': '영국',
  'Germany': '독일',
  'France': '프랑스',
  'Canada': '캐나다',
  'Australia': '호주',
  'India': '인도',
  'Brazil': '브라질',
  'Russia': '러시아',
  'Vietnam': '베트남',
  'Thailand': '태국',
  'Indonesia': '인도네시아',
  'Philippines': '필리핀',
  'Malaysia': '말레이시아',
  'Singapore': '싱가포르',
  'Taiwan': '대만',
  'Hong Kong': '홍콩',
};

export function translateCountry(country) {
  return COUNTRY_NAMES[country] || country;
}

export const CHANNEL_NAMES = {
  'Organic Search': '자연 검색',
  'Direct': '직접 방문',
  'Referral': '참조 링크',
  'Organic Social': '소셜 미디어',
  'Paid Search': '유료 검색',
  'Email': '이메일',
  'Affiliates': '제휴',
  'Display': '디스플레이 광고',
  'Paid Social': '유료 소셜',
  'Unassigned': '미분류',
};

export function translateChannel(channel) {
  return CHANNEL_NAMES[channel] || channel;
}
