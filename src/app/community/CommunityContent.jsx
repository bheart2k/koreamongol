import Link from 'next/link';
import { BookOpen, MessageCircle, Megaphone, MessageCircleQuestion, ArrowRight } from 'lucide-react';
import styles from './community.module.css';

const boards = [
  { href: '/community/blog', icon: BookOpen, title: 'Блог', description: 'Солонгос-Монголын соёл, аялал, амьдралын тухай нийтлэл' },
  { href: '/community/free', icon: MessageCircle, title: 'Чөлөөт самбар', description: 'Чөлөөтэй ярилцах, асуулт хариулт солилцох' },
  { href: '/community/notice', icon: Megaphone, title: 'Мэдэгдэл & FAQ', description: 'KoreaMongol-ын мэдэгдэл болон түгээмэл асуултууд' },
  { href: '/community/expression', icon: MessageCircleQuestion, title: 'Хэллэгийн асуулт', description: 'Солонгос хэллэгийн талаар асуулт асуух, хариулт өгөх' },
];

export default function CommunityContent() {
  return <main className="min-h-content">
    <section className={styles.hero}>
      <h1>Нийгэмлэг</h1>
      <p>Солонгос дахь амьдралын туршлагаа хуваалцаж, асуулт асууж, хамтдаа суралцах орон зай.</p>
    </section>
    <section className={styles.boards} aria-label="Самбарууд">
      {boards.map(({ href, icon: Icon, title, description }) => <Link key={href} href={href} className={styles.board}>
        <Icon aria-hidden="true" /><div><h2>{title}</h2><p>{description}</p></div><ArrowRight aria-hidden="true" />
      </Link>)}
    </section>
  </main>;
}
