'use client';

import { useState, useEffect } from 'react';
import { Briefcase, GraduationCap, BookOpen } from 'lucide-react';
import styles from './visa.module.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckList, StepList, WarningBox } from '@/components/guide';
import { visaTypes } from '@/data/guides/visa';

export default function VisaTabs() {
  const [activeTab, setActiveTab] = useState('e9');

  useEffect(() => {
    const selectFromHash = () => {
      const key = window.location.hash.replace('#visa-', '');
      if (Object.hasOwn(visaTypes, key)) setActiveTab(key);
    };
    selectFromHash();
    window.addEventListener('hashchange', selectFromHash);
    return () => window.removeEventListener('hashchange', selectFromHash);
  }, []);

  const icons = { e9: Briefcase, d2: GraduationCap, d4: BookOpen };

  return (
    <Tabs value={activeTab} onValueChange={(key) => {
      setActiveTab(key);
      window.history.replaceState(window.history.state, '', `#visa-${key}`);
    }}>
      <TabsList className={styles.tabs}>
        {Object.entries(visaTypes).map(([key, visa]) => {
          const Icon = icons[key];
          return <TabsTrigger key={key} id={`visa-${key}`} value={key} className={styles.tab}>
            <Icon aria-hidden="true" /><span>{visa.label}</span>
          </TabsTrigger>;
        })}
      </TabsList>

      {Object.entries(visaTypes).map(([key, visa]) => (
        <TabsContent key={key} value={key} className="mt-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold font-heading text-foreground mb-2">
              {visa.label}
            </h3>
            <p className="text-sm text-muted-foreground">{visa.description}</p>
          </div>

          <div>
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

          <WarningBox className={styles.warning}>
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
