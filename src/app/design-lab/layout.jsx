// 홈 리디자인 시안 비교용 — 검색 노출 금지
export const metadata = {
  title: 'Design Lab',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function DesignLabLayout({ children }) {
  return children;
}
