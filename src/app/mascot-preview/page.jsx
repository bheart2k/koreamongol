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

const concepts = [
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

export default function MascotPreviewPage() {
  return (
    <main className="min-h-content bg-warm/60 px-5 py-10 dark:bg-background sm:px-6 md:py-16">
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
            몽골의 자부심과 마자알라이의 강인함을 존중하면서도, 한국 여행자의
            친근함을 담았습니다. 이전에 적용했던 G, 실제 사진을 강하게 반영한 I,
            현재 홈페이지에 적용된 건강한 단순형 J를 나란히 비교합니다.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {concepts.map((concept) => (
            <article
              key={concept.id}
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
            >
              <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#E8F0FE_54%,#FAF6F0_100%)] p-6 dark:bg-[radial-gradient(circle_at_top,#2A4470_0%,#1B2D4F_56%,#111827_100%)]">
                <div className="absolute left-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-navy font-heading text-lg font-bold text-white shadow-md dark:bg-gold dark:text-navy">
                  {concept.id}
                </div>
                <Image
                  src={concept.image}
                  alt={concept.alt}
                  width={1024}
                  height={1536}
                  sizes="(min-width: 1024px) 31vw, (min-width: 640px) 70vw, 92vw"
                  className="h-full w-full object-contain drop-shadow-[0_20px_28px_rgba(27,45,79,0.16)]"
                />
              </div>

              <div className="p-6">
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
            후보 G, I, J 중 하나를 선택하면 해당 방향을
            기준으로 표정, 자세, 소품을 다듬어 홈페이지용 최종 캐릭터로 발전시킵니다.
          </p>
        </section>
      </div>
    </main>
  );
}
