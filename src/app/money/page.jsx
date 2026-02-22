import { Banknote, ThumbsUp, ThumbsDown, ExternalLink, Building2, CreditCard, Landmark, ShieldCheck, AlertTriangle, CircleDollarSign } from 'lucide-react';
import {
  GuideHero, GuideTOC, GuideNav, InfoTable,
  WarningBox, TipBox, LinkCard, ReportBanner, DonateBanner, ShareButtons,
} from '@/components/guide';
import { BreadcrumbJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import {
  moneyMeta, moneySections, remittanceComparison,
  remittanceMethods, exchangeTips, financeWarnings, moneyLinks,
  financeBasics, insuranceInfo,
} from '@/data/guides/money';

const BASE_URL = 'https://koreamongol.com';

export default function MoneyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Мөнгө ба санхүү', url: `${BASE_URL}/money` },
      ]} />
      <HowToJsonLd
        name="Солонгосоос Монгол руу мөнгө шилжүүлэх"
        description="GME, Hanpass, Toss зэрэг аппаар Монгол руу хялбар, хямд мөнгө шилжүүлэх алхамчилсан гарын авлага."
        steps={[
          { title: 'Шилжүүлгийн арга сонгох', description: 'GME, Hanpass, Toss, Western Union зэргийг хураамж, хурдаар нь харьцуулж сонгох' },
          { title: 'Апп татаж бүртгүүлэх', description: 'Сонгосон аппыг татаж, паспорт/외국인등록증-ээр бүртгүүлэх' },
          { title: 'Хүлээн авагчийн мэдээлэл оруулах', description: 'Монгол дахь хүлээн авагчийн нэр, банкны данс оруулах' },
          { title: 'Мөнгө шилжүүлэх', description: 'Дүн оруулж, ханш шалгаад шилжүүлэг хийх' },
        ]}
      />
    <main className="min-h-content bg-background">
      <GuideHero
        title={moneyMeta.title}
        subtitle={moneyMeta.subtitle}
        icon={Banknote}
        breadcrumbLabel="Мөнгө ба санхүү"
      >
        <GuideTOC sections={moneySections} />
      </GuideHero>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {/* Comparison Table */}
        <section id="money-comparison">
          <h2 className="text-title text-navy dark:text-sky mb-6">Шилжүүлгийн арга харьцуулалт</h2>
          <InfoTable
            headers={remittanceComparison.headers}
            rows={remittanceComparison.rows}
          />
        </section>

        {/* Method Details */}
        <section id="money-methods">
          <h2 className="text-title text-navy dark:text-sky mb-6">Арга бүрийн дэлгэрэнгүй</h2>
          <div className="space-y-6">
            {remittanceMethods.map((method) => (
              <div
                key={method.name}
                className="p-5 rounded-lg border border-border bg-card"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold font-heading text-foreground">
                    {method.name}
                  </h3>
                  {method.url && (
                    <a
                      href={method.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gold-dark hover:text-gold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Вэбсайт
                    </a>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-status-success mb-2">
                      <ThumbsUp className="w-4 h-4" />
                      Давуу тал
                    </div>
                    <ul className="space-y-1">
                      {method.pros.map((p, i) => (
                        <li key={i} className="text-sm text-muted-foreground">&#10003; {p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-status-error mb-2">
                      <ThumbsDown className="w-4 h-4" />
                      Сул тал
                    </div>
                    <ul className="space-y-1">
                      {method.cons.map((c, i) => (
                        <li key={i} className="text-sm text-muted-foreground">&#10007; {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Financial Basics */}
        <section id="money-finance">
          <h2 className="text-title text-navy dark:text-sky mb-6">
            <CircleDollarSign className="w-6 h-6 inline mr-2" />
            Санхүүгийн үндсэн мэдлэг
          </h2>

          {/* Bank Account */}
          <div className="space-y-6">
            <div className="p-5 rounded-lg border border-border bg-card">
              <h3 className="text-lg font-semibold font-heading text-foreground flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-navy dark:text-sky" />
                {financeBasics.bankAccount.title}
              </h3>
              <div className="mb-4">
                <p className="text-sm font-medium text-foreground mb-2">Шаардлагатай бичиг баримт:</p>
                <ul className="space-y-1">
                  {financeBasics.bankAccount.required.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground">&#8226; {item}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-foreground mb-2">Санал болгох банкууд:</p>
                <div className="space-y-3">
                  {financeBasics.bankAccount.banks.map((bank) => (
                    <div key={bank.name} className="p-3 rounded-md bg-muted/50">
                      <p className="text-sm font-medium text-foreground">{bank.name}</p>
                      <p className="text-sm text-muted-foreground">{bank.features}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Онлайн банк:</p>
                <div className="space-y-2">
                  {financeBasics.bankAccount.onlineBanks.map((bank) => (
                    <div key={bank.name} className="flex items-start gap-2 text-sm">
                      <span className={bank.available ? 'text-status-success' : 'text-status-error'}>
                        {bank.available ? '&#10003;' : '&#10007;'}
                      </span>
                      <div>
                        <span className="font-medium text-foreground">{bank.name}</span>
                        <span className="text-muted-foreground"> — {bank.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="p-5 rounded-lg border border-border bg-card">
              <h3 className="text-lg font-semibold font-heading text-foreground flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-navy dark:text-sky" />
                {financeBasics.cards.title}
              </h3>
              <div className="space-y-4">
                {financeBasics.cards.items.map((card) => (
                  <div key={card.type} className="p-3 rounded-md bg-muted/50">
                    <p className="text-sm font-medium text-foreground">{card.type}</p>
                    <p className="text-sm text-muted-foreground mb-1">{card.description}</p>
                    <p className="text-xs text-gold-dark">&#128196; {card.condition}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ATM */}
            <div className="p-5 rounded-lg border border-border bg-card">
              <h3 className="text-lg font-semibold font-heading text-foreground flex items-center gap-2 mb-4">
                <Landmark className="w-5 h-5 text-navy dark:text-sky" />
                {financeBasics.atm.title}
              </h3>
              <ul className="space-y-1 mb-3">
                {financeBasics.atm.items.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground">&#8226; {item}</li>
                ))}
              </ul>
              <TipBox title="Үнэгүй ATM">
                <p className="text-sm">{financeBasics.atm.freeAtmTip}</p>
              </TipBox>
            </div>

            {/* Tugrik Warning */}
            <WarningBox title={financeBasics.tugrikWarning.title}>
              <ul className="space-y-1">
                {financeBasics.tugrikWarning.items.map((item, i) => (
                  <li key={i}>&#8226; {item}</li>
                ))}
              </ul>
            </WarningBox>
          </div>
        </section>

        {/* Insurance */}
        <section id="money-insurance">
          <h2 className="text-title text-navy dark:text-sky mb-6">
            <ShieldCheck className="w-6 h-6 inline mr-2" />
            {insuranceInfo.title}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">{insuranceInfo.subtitle}</p>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {insuranceInfo.items.map((ins) => (
              <div key={ins.name} className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{ins.emoji}</span>
                  <h3 className="text-sm font-semibold font-heading text-foreground">{ins.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{ins.description}</p>
                <p className="text-xs text-gold-dark">{ins.note}</p>
              </div>
            ))}
          </div>

          {/* Pension Refund */}
          <div className="p-5 rounded-lg border-2 border-gold/30 bg-gold/5">
            <h3 className="text-lg font-semibold font-heading text-foreground flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-gold" />
              {insuranceInfo.refund.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{insuranceInfo.refund.description}</p>
            <ol className="space-y-2 mb-4">
              {insuranceInfo.refund.steps.map((step, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="font-bold text-navy dark:text-sky shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
            <WarningBox title="Анхаар!">
              <p>{insuranceInfo.refund.warning}</p>
            </WarningBox>
          </div>
        </section>

        {/* Warnings */}
        <section id="money-warnings">
          <h2 className="text-title text-navy dark:text-sky mb-6">Анхааруулга</h2>
          {financeWarnings.map((warning) => (
            <WarningBox key={warning.title} title={warning.title}>
              <ul className="space-y-1">
                {warning.items.map((item, i) => (
                  <li key={i}>&#8226; {item}</li>
                ))}
              </ul>
            </WarningBox>
          ))}
        </section>

        {/* Tips */}
        <section id="money-tips">
          <h2 className="text-title text-navy dark:text-sky mb-6">Зөвлөгөө</h2>
          <TipBox title="Ханшийн зөвлөгөө">
            <ul className="space-y-1">
              {exchangeTips.map((tip, i) => (
                <li key={i}>&#8226; {tip}</li>
              ))}
            </ul>
          </TipBox>
        </section>

        {/* Links */}
        <section id="money-links">
          <h2 className="text-title text-navy dark:text-sky mb-6">Хэрэгтэй линкүүд</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {moneyLinks.map((link) => (
              <LinkCard key={link.href} {...link} />
            ))}
          </div>
        </section>

        <ReportBanner pageUrl="/money" />
        <DonateBanner />
        <ShareButtons />
        <GuideNav currentGuideId="money" />
      </div>
    </main>
    </>
  );
}
