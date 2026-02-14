'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReportDialog from './ReportDialog';

export function ReportBanner({ pageUrl }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mt-12 mb-4 p-5 rounded-lg border-2 border-gold/40 bg-gold/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <AlertCircle className="w-5 h-5 text-gold-dark shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Хамтдаа бүтээе!
              </p>
              <p className="text-xs text-muted-foreground">
                Бид мэдээллийг нягтлан шалгасан боловч алдаа байж болно. Буруу мэдээлэл олвол бидэнд мэдэгдэнэ үү.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            className="shrink-0 border-gold/40 text-gold-dark hover:bg-gold/10"
          >
            Мэдээлэл засах
          </Button>
        </div>
      </div>

      <ReportDialog
        open={open}
        onOpenChange={setOpen}
        pageUrl={pageUrl}
      />
    </>
  );
}
