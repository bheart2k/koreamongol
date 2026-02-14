import { Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_ITEMS = [
  { label: 'Яаралтай тусламж', number: '119', emoji: '🚑' },
  { label: 'Цагдаа', number: '112', emoji: '🚔' },
  { label: 'Гадаадын иргэн', number: '1345', emoji: '📞' },
];

export function EmergencyBanner({ items = DEFAULT_ITEMS, sticky = false, className }) {
  return (
    <div
      className={cn(
        'bg-terracotta text-white py-3 px-4 md:px-6',
        sticky && 'sticky top-16 z-30',
        className
      )}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">
        {items.map((item) => (
          <a
            key={item.number}
            href={`tel:${item.number}`}
            className="flex items-center gap-2 text-sm font-semibold font-heading hover:text-gold-light transition-colors"
          >
            <span>{item.emoji}</span>
            <span>{item.label}:</span>
            <span className="underline underline-offset-2">{item.number}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
