import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Check, ShieldCheck, Sparkles } from 'lucide-react';

export const metadata = {
  title: '마자알라이 캐릭터 시안',
  robots: {
    index: false,
    follow: false,
  },
};

const previousConcepts = [
  {
    id: 'G',
    name: '한국에 온 여행자',
    image: '/images/mascot-preview/mazaalai-g.png',
    alt: '카메라와 여행가방을 갖고 한국에 도착한 직립 마자알라이 캐릭터',
    summary: 'G의 듬직한 인상을 유지하며 한국 여행자의 설렘을 더한 직립 시안',
    strengths: ['곰다운 넓은 체형과 큰 발을 유지함', '카메라와 여행가방으로 한국 방문 목적이 분명함', '세로형 홈페이지 히어로에 자연스럽게 배치됨'],
    consideration: '작은 크기에서는 여행가방의 세부 장식이 단순하게 보일 수 있음',
    badge: '이전 적용 · 여행자형',
  },
  {
    id: 'I',
    name: '실사 반영 마자알라이 여행자',
    image: '/images/mascot-preview/mazaalai-i.png',
    alt: '한국 교통지도와 여행가방을 든 실사 반영 직립 마자알라이 캐릭터',
    summary: '실제 마자알라이 사진의 얼굴과 털, 체형을 기준으로 다시 설계한 한국 여행자 시안',
    strengths: ['둥근 볼을 줄이고 좁고 긴 주둥이와 작은 눈·귀를 반영함', '어두운 목과 앞다리, 옅은 가슴 반점으로 마자알라이의 특징을 살림', '접이식 한국 교통지도와 여행가방으로 방문 목적이 분명함'],
    consideration: '실제 동물의 비율과 직립 캐릭터의 친근함 사이에서 얼굴의 사실성을 유지하는 것이 중요함',
    badge: '새 비교안 · 실사 반영형',
  },
  {
    id: 'J',
    name: '건강한 단순형 마자알라이',
    image: '/images/mascot-preview/mazaalai-j.png',
    alt: '한국 교통지도와 크로스백을 든 건강하고 단순한 직립 마자알라이 캐릭터',
    summary: '건강한 마자알라이 사진의 둥근 몸체를 살리면서 표정과 털을 단순하게 정리한 시안',
    strengths: ['등과 배, 엉덩이에 자연스러운 볼륨을 남겨 굶거나 애처로운 인상을 없앰', '좁은 주둥이와 작은 귀로 일반 불곰과 다른 마자알라이의 인상을 유지함', '카메라 대신 접이식 한국 교통지도와 크로스백을 사용함'],
    consideration: '귀여운 방향으로 단순화한 만큼 실제 종의 특징이 흐려지지 않도록 주둥이와 다리 비율을 유지해야 함',
    badge: '현재 적용 · 건강한 단순형',
  },
];

const concepts = [
  previousConcepts.find((concept) => concept.id === 'J'),
  {
    id: 'K',
    name: '담백한 2D 친구',
    image: '/images/mascot-preview/mazaalai-k.png',
    alt: '남색 크로스백을 메고 손을 흔드는 황갈색 곰의 단순한 2D 시안',
    summary: '털 묘사와 소품을 줄이고, 선명한 윤곽과 반기는 손짓으로 친근함을 표현했습니다.',
    strengths: ['작은 화면에서도 윤곽과 표정이 선명함', '기존 남색과 황갈색을 자연스럽게 이어감', '안내 카드와 다양한 자세로 확장하기 좋은 그림체'],
    consideration: '마자알라이 고유의 인상은 주둥이와 귀 모양을 더 다듬을 여지가 있습니다.',
    badge: '새 샘플 · 2D형',
  },
  {
    id: 'L',
    name: '색연필 동화 속 친구',
    image: '/images/mascot-preview/mazaalai-l.png',
    alt: '남색 크로스백을 메고 인사하는 곰을 부드러운 색연필로 그린 시안',
    summary: '종이와 색연필의 질감을 살려 편안하고 정감 있는 분위기를 만들었습니다.',
    strengths: ['손으로 그린 듯한 따뜻한 질감', '기존 곰의 자연스러운 체형과 연결됨', '생활 이야기를 담은 큰 삽화에 어울림'],
    consideration: '작게 표시하면 털의 세부 묘사가 뭉칠 수 있어 축소 상태도 함께 살펴보세요.',
    badge: '새 샘플 · 동화형',
  },
  {
    id: 'M',
    name: '포근한 봉제인형 친구',
    image: '/images/mascot-preview/mazaalai-m.png',
    alt: '짧고 부드러운 털과 둥근 몸을 가진 봉제인형 스타일의 곰 시안',
    summary: '부드러운 천의 질감과 둥근 몸으로 포근한 인상을 강조했습니다.',
    strengths: ['입체감과 부드러운 소재감', '단순한 소품과 편안한 표정', '첫 화면에서 시선을 모으는 존재감'],
    consideration: '일반 테디베어처럼 보일 수 있어 브랜드 고유의 개성은 추가 검토가 필요합니다.',
    badge: '새 샘플 · 봉제인형형',
  },
  {
    id: 'M2',
    name: '얄상한 봉제인형 친구',
    image: '/images/mascot-preview/mazaalai-m2.png',
    alt: '기존 M보다 볼과 몸통을 줄이고 목과 팔다리를 길게 다듬은 봉제인형 곰 시안',
    summary: 'M의 봉제 질감을 유지하면서 볼과 배의 볼륨을 줄이고, 목과 팔다리를 더 길고 가늘게 다듬었습니다.',
    strengths: ['기존 M보다 얄상한 실루엣', '포근한 소재와 인사하는 자세 유지', 'L의 손그림 질감과 M의 입체 질감을 비교할 수 있음'],
    consideration: '몸은 한결 얄상해졌지만 얼굴에는 아직 테디베어의 둥근 인상이 남아 있습니다.',
    badge: 'M 수정안 · 얄상한 비율',
  },
];

const comparisonOrder = ['L', 'M', 'M2', 'J', 'K'];

export default function MascotPreviewPage() {
  return (
    <main lang="ko" className="min-h-content bg-warm/60 px-5 py-10 dark:bg-background sm:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-navy dark:hover:text-sky"
        >
          <ArrowLeft className="h-4 w-4" />
          홈페이지로 돌아가기
        </Link>

        <header className="mb-10 max-w-3xl md:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold-dark dark:text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            TEMPORARY MASCOT REVIEW
          </div>
          <h1 className="text-headline text-navy dark:text-sky">
            마자알라이 캐릭터 시안
          </h1>
          <p className="mt-4 text-body-lg leading-relaxed text-muted-foreground">
            L · 기존 M · 수정안 M2를 먼저 나란히 비교합니다.
            M2는 봉제 질감을 살리면서 얼굴과 몸을 더 얄상하게 다듬은 시안입니다.
            현재 홈페이지의 J와 2D 시안 K도 아래에서 확인할 수 있습니다.
            새 샘플은 아이보리 배경을 포함한 비교용 이미지입니다.
          </p>
        </header>

        <section aria-label="현재 캐릭터와 새 샘플 비교" className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {comparisonOrder.map((id) => concepts.find((concept) => concept.id === id)).map((concept) => (
            <article
              key={concept.id}
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
            >
              <a href={concept.image} target="_blank" rel="noopener noreferrer" aria-label={`${concept.id} ${concept.name} 원본 보기 (새 탭)`} className="relative flex aspect-[2/3] items-center justify-center overflow-hidden bg-[#FAF6F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">
                <div className="absolute left-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-navy font-heading text-lg font-bold text-white shadow-md dark:bg-gold dark:text-navy">
                  {concept.id}
                </div>
                <Image
                  src={concept.image}
                  alt={concept.alt}
                  width={1024}
                  height={1536}
                  sizes="(min-width: 1280px) 400px, (min-width: 1024px) 31vw, 46vw"
                  className="h-full w-full object-contain"
                />
              </a>

              <div className="p-3 sm:p-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl font-bold font-heading text-navy dark:text-sky">
                    {concept.name}
                  </h2>
                  <span className="rounded-full bg-sky px-2.5 py-1 text-xs font-semibold text-navy dark:bg-navy-light dark:text-gold">
                    {concept.badge}
                  </span>
                </div>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                  {concept.summary}
                </p>

                <ul className="mb-5 space-y-2.5">
                  {concept.strengths.map((strength) => (
                    <li key={strength} className="flex gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-status-success" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-xl border border-border bg-muted/50 p-4">
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-navy dark:text-sky">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    선택 전 고려할 점
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {concept.consideration}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-gold/30 bg-gold/5 p-6 text-center md:p-8">
          <h2 className="font-heading text-lg font-bold text-navy dark:text-sky">
            선택 방법
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            이미지를 누르면 원본을 새 탭에서 크게 볼 수 있습니다.
            L의 손그림 느낌과 M · M2의 봉제 질감, 얼굴과 몸의 비율을 비교해 보세요.
            홈페이지에는 현재 J가 적용되어 있습니다.
          </p>
        </section>
      </div>
    </main>
  );
}
