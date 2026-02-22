const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Үйлчилгээний нөхцөл',
  description: 'KoreaMongol үйлчилгээний нөхцөл',
  openGraph: {
    title: 'Үйлчилгээний нөхцөл | KoreaMongol',
    description: 'KoreaMongol үйлчилгээний нөхцөл',
    url: `${BASE_URL}/terms`,
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: `${BASE_URL}/terms`,
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-content bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-headline mb-8">Үйлчилгээний нөхцөл</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <p className="text-muted-foreground">Хүчинтэй огноо: 2026 оны 2 сарын 14</p>

          <section className="space-y-4">
            <h2 className="text-title">1. Зорилго</h2>
            <p className="text-body text-muted-foreground">
              Энэхүү нөхцөл нь KoreaMongol (цаашид &quot;Үйлчилгээ&quot;)-ийн үзүүлж буй үйлчилгээний ашиглалтын нөхцөл, журмыг тодорхойлоход оршино.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-title">2. Үйлчилгээний агуулга</h2>
            <p className="text-body text-muted-foreground">
              KoreaMongol нь дараах үйлчилгээг үзүүлнэ:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Солонгос-Монголын амьдрал, соёлын мэдээлэл</li>
              <li>Нийгэмлэг, хамтын нийтлэл</li>
              <li>Холбогдох хэрэгслүүд</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-title">3. Хэрэглэгчийн үүрэг</h2>
            <p className="text-body text-muted-foreground">
              Хэрэглэгч дараах үйлдлийг хийхийг хориглоно:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Бусдын хувийн мэдээллийг хууль бусаар ашиглах</li>
              <li>Үйлчилгээний хэвийн үйл ажиллагаанд саад учруулах</li>
              <li>Хууль бус зорилгоор үйлчилгээг ашиглах</li>
              <li>Үйлчилгээний контентыг зөвшөөрөлгүй хуулж тарааах</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-title">4. Оюуны өмч</h2>
            <p className="text-body text-muted-foreground">
              Үйлчилгээнд байгаа контент (дизайн, текст, зураг гэх мэт)-ын зохиогчийн эрх нь KoreaMongol-д хамаарна.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-title">5. Хариуцлага хүлээхгүй</h2>
            <p className="text-body text-muted-foreground">
              KoreaMongol нь үнэ төлбөргүй үйлчилгээ бөгөөд үйлчилгээг ашигласнаас үүдэн гарах шууд болон шууд бус хохиролд хариуцлага хүлээхгүй.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-title">6. Үйлчилгээний өөрчлөлт, зогсолт</h2>
            <p className="text-body text-muted-foreground">
              KoreaMongol нь үйлчилгээний агуулгыг өөрчлөх буюу зогсоох боломжтой бөгөөд энэ тохиолдолд урьдчилан мэдэгдэнэ.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-title">7. Нөхцөлийн өөрчлөлт</h2>
            <p className="text-body text-muted-foreground">
              Энэхүү нөхцөл нь шаардлагатай бол өөрчлөгдөж болох бөгөөд өөрчлөлт нь үйлчилгээн дотор мэдэгдсэнээр хүчин төгөлдөр болно.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-title">8. Холбоо барих</h2>
            <p className="text-body text-muted-foreground">
              Үйлчилгээтэй холбоотой асуулт: koreamongol@googlegroups.com
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
