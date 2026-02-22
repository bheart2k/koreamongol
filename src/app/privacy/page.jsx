const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Нууцлалын бодлого',
  description: 'KoreaMongol Нууцлалын бодлого',
  openGraph: {
    title: 'Нууцлалын бодлого | KoreaMongol',
    description: 'KoreaMongol Нууцлалын бодлого',
    url: `${BASE_URL}/privacy`,
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: `${BASE_URL}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-content bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-headline mb-8">Нууцлалын бодлого</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <p className="text-muted-foreground">Хүчинтэй огноо: 2026 оны 2 сарын 14</p>

          <section className="space-y-4">
            <h2 className="text-title">1. Цуглуулж буй мэдээлэл</h2>
            <p className="text-body text-muted-foreground">
              KoreaMongol нь үйлчилгээг сайжруулах зорилгоор дараах мэдээллийг цуглуулна:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Автоматаар цуглуулах: Хөтчийн төрөл, зочилсон хуудас, нэвтрэх хугацаа (Google Analytics)</li>
              <li>Хэрэглэгчийн бүртгэл: Нэр, имэйл, профайл зураг (Google нэвтрэлт)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-title">2. Мэдээлэл ашиглах зорилго</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Үйлчилгээ сайжруулахад зориулсан статистик шинжилгээ</li>
              <li>Хэрэглэгчийн туршлага дээшлүүлэх</li>
              <li>Нийгэмлэгийн функц (нийтлэл, сэтгэгдэл) хэрэгжүүлэх</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-title">3. Мэдээлэл хадгалах, устгах</h2>
            <p className="text-body text-muted-foreground">
              Цуглуулсан мэдээлэл нь хувь хүнийг шууд таних боломжгүй хэлбэрээр хадгалагдах бөгөөд шаардлагатай бол устгагдаж болно.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-title">4. Күүки</h2>
            <p className="text-body text-muted-foreground">
              KoreaMongol нь хэрэглэгчийн туршлага болон үйлчилгээний шинжилгээнд күүки ашигладаг. Та хөтчийн тохиргоогоор күүкиг идэвхгүйжүүлэх боломжтой.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-title">5. Гуравдагч тал</h2>
            <p className="text-body text-muted-foreground">
              KoreaMongol нь дараах гуравдагч талын үйлчилгээг ашигладаг:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Google Analytics: Вэб сайтын шинжилгээ</li>
              <li>Google OAuth: Хэрэглэгчийн нэвтрэлт</li>
              <li>Cloudflare R2: Зураг хадгалалт</li>
            </ul>
            <p className="text-body text-muted-foreground mt-2">
              Эдгээрээс бусад цуглуулсан мэдээлэл нь гуравдагч талд дамжуулагдахгүй. Хуулийн дагуу шаардлагатай тохиолдол үүнээс хасагдана.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-title">6. Хэрэглэгчийн эрх</h2>
            <p className="text-body text-muted-foreground">
              Хэрэглэгч хүссэн үедээ хувийн мэдээллээ үзэх, засах, устгахыг хүсэх боломжтой. Холбогдох хүсэлтийг доорх хаягаар илгээнэ үү.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-title">7. Холбоо барих</h2>
            <p className="text-body text-muted-foreground">
              Нууцлалтай холбоотой асуулт: koreamongol@googlegroups.com
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-title">8. Өөрчлөлтийн түүх</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>2026.02.14: Анхны хувилбар</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
