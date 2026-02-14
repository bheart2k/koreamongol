'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  BookOpen,
  MessageCircle,
  Megaphone,
  ArrowRight,
  Users,
  TrendingUp,
  Clock,
  Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdBanner from '@/components/ui/ad-banner';

const boards = [
  {
    code: 'blog',
    icon: BookOpen,
    titleKo: '한글 블로그',
    titleEn: 'Hangul Blog',
    descKo: '한글 관련 포스팅, 학습 팁, 문화 콘텐츠를 공유하는 공간입니다.',
    descEn: 'A space to share Hangul-related posts, learning tips, and cultural content.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    code: 'fonts',
    href: '/tools/fonts',
    icon: Type,
    titleKo: '폰트 갤러리',
    titleEn: 'Font Gallery',
    descKo: '상업용 무료 한글 폰트 45종을 한눈에 살펴보세요.',
    descEn: 'Explore 45 free Korean fonts for commercial use.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
];

const features = [
  {
    icon: Users,
    titleKo: '함께 배우기',
    titleEn: 'Learn Together',
    descKo: '전 세계 한글 학습자들과 교류하세요',
    descEn: 'Connect with Hangul learners worldwide',
  },
  {
    icon: TrendingUp,
    titleKo: '포인트 획득',
    titleEn: 'Earn Points',
    descKo: '게시글 작성 시 20포인트 획득',
    descEn: 'Get 20 points for writing posts',
  },
  {
    icon: Clock,
    titleKo: '실시간 소통',
    titleEn: 'Real-time Chat',
    descKo: '질문하고 바로 답변을 받아보세요',
    descEn: 'Ask questions and get answers quickly',
  },
];

export default function CommunityContent() {
  const locale = 'ko';
  const isKo = locale === 'ko';

  return (
    <main className="min-h-content bg-background">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-6">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-display mb-4">
              {isKo ? (
                <>
                  한글을 사랑하는
                  <br />
                  <span className="text-accent">사람들의 공간</span>
                </>
              ) : (
                <>
                  A Space for
                  <br />
                  <span className="text-accent">Hangul Lovers</span>
                </>
              )}
            </h1>
            <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
              {isKo
                ? '한글에 대한 이야기를 나누고, 함께 배우며, 새로운 인연을 만들어보세요.'
                : 'Share stories about Hangul, learn together, and make new connections.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 px-6 border-y border-border bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.titleEn}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">
                      {isKo ? feature.titleKo : feature.titleEn}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isKo ? feature.descKo : feature.descEn}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Board List */}
      <section className="py-12 md:py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-10"
          >
            <h2 className="text-headline mb-2">
              {isKo ? '게시판 선택' : 'Choose a Board'}
            </h2>
            <p className="text-muted-foreground">
              {isKo
                ? '관심 있는 게시판을 선택하세요'
                : 'Select the board that interests you'}
            </p>
          </motion.div>

          <div className="grid gap-4">
            {boards.map((board, index) => {
              const Icon = board.icon;
              return (
                <motion.div
                  key={board.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    href={board.href || `/community/${board.code}`}
                    className="group block"
                  >
                    <div className="flex items-center gap-5 p-6 bg-card border border-border rounded-2xl transition-all duration-200 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
                      <div className={`w-14 h-14 rounded-xl ${board.bgColor} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-7 h-7 ${board.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-title font-semibold mb-1 group-hover:text-accent transition-colors">
                          {isKo ? board.titleKo : board.titleEn}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {isKo ? board.descKo : board.descEn}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <AdBanner type="display" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-headline mb-4">
              {isKo ? '한글 이야기를 만나보세요' : 'Discover Hangul Stories'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isKo
                ? '한글에 대한 유용한 정보와 재미있는 이야기가 기다리고 있어요.'
                : 'Useful information and interesting stories about Hangul await you.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg">
                <Link href="/community/blog">
                  {isKo ? '블로그 읽으러 가기' : 'Read Blog Posts'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
