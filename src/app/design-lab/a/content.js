// 시안 A 「같은 하늘 아래」 — 챕터 구성·에셋 경로·새 문구
// 서버(page.jsx)에서만 import 한다. 클라이언트에는 직렬화된 값만 props 로 넘긴다.
import { guides, situations } from '../_shared/home-data';
import { LAB_ASSET_BASE } from '../_shared/asset';

export const ASSET = `${LAB_ASSET_BASE}/a`; // R2 CDN (cdn.koreamongol.com)

// 새 몽골어 문구 (원어민 검수 필요) — 보고서 목록과 1:1
export const COPY = {
  skyKicker: 'Мөнх хөх тэнгэр',
  skyTitle: 'Нэг тэнгэр дор',
  skyRoute: 'Улаанбаатараас Сөүл хүртэл',
  scrollCue: 'Доош гүйлгэнэ үү',
  finaleLine: 'Гэрээсээ хол ч, нэг л тэнгэр дор.', // нэг·л 사이 줄바꿈 방지
  pauseVideo: 'Видеог түр зогсоох',
  playVideo: 'Видеог тоглуулах',
  chapterBefore: 'Ирэхээс өмнө',
  chapterCulture: 'Хэл ба соёл',
  chapterWork: 'Ажил',
  chapterLife: 'Амьдрал',
  emergencyToggle: 'Яаралтай',
};

// 좌표 HUD (위키백과 표기 기준: 울란바토르 47°55′N 106°55′E, 서울 37°33′N 126°59′E)
export const ROUTE = {
  from: { city: 'Улаанбаатар', lat: 47 + 55 / 60, lon: 106 + 55 / 60 },
  to: { city: 'Сөүл', lat: 37 + 33 / 60, lon: 126 + 59 / 60 },
};

const tipsLink = situations.find((s) => s.href === '/tips');

function guideLinks(ids) {
  return ids.map((id) => {
    if (id === 'tips') return { id, href: tipsLink.href, title: tipsLink.label, desc: '' };
    const g = guides.find((x) => x.id === id);
    return { id, href: g.href, title: g.title, desc: g.desc };
  });
}

// 하루의 흐름 순서: 새벽(떠나기 전) → 아침(도착·일) → 오후(말과 문화) → 노을(생활·사람들)
// emergency 가이드는 하단 플로팅 버튼(EmergencyDock)에 연결
export const CHAPTERS = [
  { id: 'before', no: '01', time: '05:40', title: COPY.chapterBefore, media: 'c1', links: guideLinks(['visa', 'topik']) },
  { id: 'arrival', no: '02', time: '07:15', title: guides.find((g) => g.id === 'arrival').title, media: 'c2', links: guideLinks(['arrival', 'transport', 'apps']) },
  { id: 'work', no: '03', time: '08:30', title: COPY.chapterWork, media: 'c3', links: guideLinks(['jobs', 'severance']) },
  { id: 'culture', no: '04', time: '15:20', title: COPY.chapterCulture, media: 'c4', links: guideLinks(['korean', 'tips']) },
  { id: 'life', no: '05', time: '18:40', title: COPY.chapterLife, media: 'c5', links: guideLinks(['housing', 'hospital', 'money', 'exchange']) },
  { id: 'people', no: '06', time: '19:30', title: guides.find((g) => g.id === 'community').title, media: 'c6', links: guideLinks(['community']) },
];

export const COMMUNITY = (() => {
  const g = guides.find((x) => x.id === 'community');
  return { href: g.href, title: g.title, desc: g.desc };
})();

export const EMERGENCY_GUIDE = (() => {
  const g = guides.find((x) => x.id === 'emergency');
  return { href: g.href, title: g.title, desc: g.desc };
})();
