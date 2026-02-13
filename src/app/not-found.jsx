import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <span className="text-[120px] md:text-[180px] font-heading font-bold text-navy/10 select-none leading-none">
            404
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Хуудас олдсонгүй
          </h1>
          <p className="text-muted-foreground">
            Таны хайсан хуудас байхгүй эсвэл шилжүүлсэн байна.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-terracotta text-white font-medium rounded-lg hover:bg-terracotta-dark transition-colors"
          >
            Нүүр хуудас руу буцах
          </Link>
        </div>
      </div>
    </main>
  );
}
