'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/**
 * FAQ 아코디언 컴포넌트
 */
export function FAQAccordion({ items }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border-border px-6">
          <AccordionTrigger className="text-left hover:no-underline hover:text-accent">
            <span className="pr-4">{item.question}</span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            {item.answer}
            {item.link && (
              <Link
                href={item.link.href}
                className="block mt-2 text-accent hover:underline"
              >
                {item.link.label} →
              </Link>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
