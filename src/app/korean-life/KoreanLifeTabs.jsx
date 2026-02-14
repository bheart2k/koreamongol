'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LanguageCard } from '@/components/guide';
import { survivalKorean } from '@/data/guides/korean-life';

export default function KoreanLifeTabs() {
  const [langTab, setLangTab] = useState('daily');

  return (
    <Tabs value={langTab} onValueChange={setLangTab}>
      <TabsList>
        <TabsTrigger value="daily">Өдөр тутам</TabsTrigger>
        <TabsTrigger value="work">Ажлын газар</TabsTrigger>
      </TabsList>

      <TabsContent value="daily" className="mt-6">
        <div className="grid sm:grid-cols-2 gap-3">
          {survivalKorean.daily.map((item) => (
            <LanguageCard key={item.korean} {...item} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="work" className="mt-6" id="kl-work">
        <div className="grid sm:grid-cols-2 gap-3">
          {survivalKorean.work.map((item) => (
            <LanguageCard key={item.korean} {...item} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
