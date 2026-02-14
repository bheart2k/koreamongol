'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckList, StepList, WarningBox } from '@/components/guide';
import { visaTypes } from '@/data/guides/visa';

export default function VisaTabs() {
  const [activeTab, setActiveTab] = useState('e9');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full justify-start">
        <TabsTrigger value="e9">E-9</TabsTrigger>
        <TabsTrigger value="d2">D-2</TabsTrigger>
        <TabsTrigger value="d4">D-4</TabsTrigger>
      </TabsList>

      {Object.entries(visaTypes).map(([key, visa]) => (
        <TabsContent key={key} value={key} className="mt-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold font-heading text-foreground mb-2">
              {visa.label}
            </h3>
            <p className="text-sm text-muted-foreground">{visa.description}</p>
          </div>

          <div id={`visa-${key}`}>
            <h4 className="text-base font-semibold font-heading text-foreground mb-4">
              Шаардлагатай бичиг баримт
            </h4>
            <CheckList items={visa.documents} storageKey={`visa-${key}-docs`} />
          </div>

          <div>
            <h4 className="text-base font-semibold font-heading text-foreground mb-4">
              Визний үе шат
            </h4>
            <StepList steps={visa.steps} />
          </div>

          <WarningBox>
            <ul className="space-y-1">
              {visa.warnings.map((w, i) => (
                <li key={i}>• {w}</li>
              ))}
            </ul>
          </WarningBox>
        </TabsContent>
      ))}
    </Tabs>
  );
}
