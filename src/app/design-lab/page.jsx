import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import LabCard from './_shared/LabCard';
import videoStyles from './videos/videos.module.css';
import { criteria, variants } from './_shared/lab-meta';
import styles from './_shared/lab-index.module.css';

export const metadata = {
  title: '홈 리디자인 시안 비교',
  description: '홈 리디자인 시안 비교 (내부용)',
};

// 참고용 보관(종료) 시안은 맨 뒤로 — 같은 그룹 안에서는 메타 순서(A→E)를 유지한다
const ordered = [...variants].sort((a, b) => Number(!!a.archived) - Number(!!b.archived));

const RULES = [
  '모든 시안이 현재 홈의 콘텐츠를 그대로 담음',
  '가이드 14개 링크 실제 동작',
  '몽골어 문구 원문 유지',
  '모바일 390px 별도 아트 디렉션',
];

export default function DesignLabIndex() {
  return (
    <main className={`${styles.lab} min-h-content`}>
      <div className={styles.container}>
        <header className={styles.masthead}>
          <p className={`${styles.kicker} ${styles.rise}`}>KoreaMongol · Design Lab</p>
          <h1 className={styles.title}>
            <span className={styles.line}><span style={{ '--d': 0 }}>홈 리디자인</span></span>{' '}
            <span className={styles.line}><span style={{ '--d': 140 }}><em>시안 {ordered.length}종</em></span></span>
          </h1>
          <p className={`${styles.sub} ${styles.rise}`} style={{ '--i': 2 }}>
            같은 콘텐츠, 서로 다른 컨셉. 직접 열어 스크롤해 보고, 모바일 폭에서도 확인한 뒤 고르세요.
          </p>
          <ul className={`${styles.rules} ${styles.rise}`} style={{ '--i': 3 }} aria-label="공통 조건">
            {RULES.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </header>

        <Link href="/design-lab/videos" className={videoStyles.labLink}>
          <span className={videoStyles.labLinkText}>
            <strong>생성 영상 보기</strong>
            <span>젠스파크로 만든 영상과 입력한 시작·끝 프레임을 나란히 비교</span>
          </span>
          <ArrowRight className={videoStyles.labLinkArrow} aria-hidden="true" />
        </Link>

        <section className={styles.cards} aria-label="시안 목록">
          {ordered.map((variant, index) => (
            <LabCard key={variant.id} variant={variant} index={index} />
          ))}
        </section>

        <section className={styles.criteria} aria-label="평가 기준">
          <div>
            <h2>용량 예산</h2>
            <ul className={styles.budget}>
              {criteria.budget.map((b) => (
                <li key={b.label}><span>{b.label}</span><strong>{b.value}</strong></li>
              ))}
            </ul>
          </div>
          <div>
            <h2>QA 항목</h2>
            <ol className={styles.qa}>
              {criteria.qa.map((q) => <li key={q}>{q}</li>)}
            </ol>
          </div>
          <p className={styles.note}>검색 엔진에 노출되지 않는 내부 비교용 페이지입니다.</p>
        </section>
      </div>
    </main>
  );
}
