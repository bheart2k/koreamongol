import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

const alertVariants = cva(
  'relative w-full rounded-xl p-5 flex items-start gap-4 border-l-4 animate-in fade-in-0 slide-in-from-top-2 duration-300 ease-out',
  {
    variants: {
      variant: {
        default: 'bg-card border-l-accent',
        success: 'bg-status-success-light border-l-status-success',
        warning: 'bg-status-warning-light border-l-status-warning',
        error: 'bg-status-error-light border-l-status-error',
        info: 'bg-status-info-light border-l-status-info',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const iconVariants = cva(
  'w-6 h-6 rounded-full flex items-center justify-center shrink-0 p-1',
  {
    variants: {
      variant: {
        default: 'bg-accent text-accent-foreground',
        success: 'bg-status-success text-white',
        warning: 'bg-status-warning text-white',
        error: 'bg-status-error text-white',
        info: 'bg-status-info text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const titleVariants = cva('font-semibold text-[0.95rem] mb-1', {
  variants: {
    variant: {
      default: 'text-accent',
      success: 'text-status-success-dark',
      warning: 'text-status-warning-dark',
      error: 'text-status-error-dark',
      info: 'text-status-info-dark',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const icons = {
  default: CheckCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

function Alert({ className, variant = 'default', children, ...props }) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

function AlertIcon({ variant = 'default', className }) {
  const Icon = icons[variant];
  return (
    <div className={cn(iconVariants({ variant }), className)}>
      <Icon className="w-4 h-4" />
    </div>
  );
}

function AlertTitle({ className, variant = 'default', children, ...props }) {
  return (
    <h5 className={cn(titleVariants({ variant }), className)} {...props}>
      {children}
    </h5>
  );
}

function AlertDescription({ className, children, ...props }) {
  return (
    <div className={cn('text-sm text-muted-foreground', className)} {...props}>
      {children}
    </div>
  );
}

function AlertContent({ className, children, ...props }) {
  return (
    <div className={cn('flex-1', className)} {...props}>
      {children}
    </div>
  );
}

export { Alert, AlertIcon, AlertTitle, AlertDescription, AlertContent };
