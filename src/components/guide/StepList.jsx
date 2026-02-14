import { cn } from '@/lib/utils';

export function StepList({ steps = [], className }) {
  if (steps.length === 0) return null;

  return (
    <div className={cn('space-y-0', className)}>
      {steps.map((step, index) => (
        <div
          key={index}
          className={cn(
            'flex gap-4 py-4',
            index < steps.length - 1 && 'border-b border-border'
          )}
        >
          <div className="w-8 h-8 rounded-full bg-navy dark:bg-sky text-white dark:text-navy flex items-center justify-center text-sm font-bold font-heading shrink-0 mt-0.5">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold font-heading text-foreground mb-1">
              {step.title}
            </h4>
            {step.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
