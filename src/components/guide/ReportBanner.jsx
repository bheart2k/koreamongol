'use client';

import { useState } from 'react';
import { AlertCircle, MessageCircleQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReportDialog from './ReportDialog';
import AskQuestionDialog from './AskQuestionDialog';

export function ReportBanner({ pageUrl }) {
  const [open, setOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);

  return (
    <>
      <div className="mt-6 py-5 border-t border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
          <div className="flex items-start gap-3 flex-1">
            <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Хамтдаа бүтээе!
              </p>
              <p className="text-xs text-muted-foreground">
                Буруу мэдээлэл олсон эсвэл асуух зүйл байвал бидэнд мэдэгдээрэй — бид олж мэдээд хариулна.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 min-w-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAskOpen(true)}
              className="min-h-11 border-border text-foreground hover:bg-secondary hover:text-secondary-foreground"
            >
              <MessageCircleQuestion className="w-4 h-4 mr-1.5" />
              Асуулт асуух
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(true)}
              className="min-h-11 border-border text-foreground hover:bg-secondary hover:text-secondary-foreground"
            >
              Мэдээлэл засах
            </Button>
          </div>
        </div>
      </div>

      <ReportDialog
        open={open}
        onOpenChange={setOpen}
        pageUrl={pageUrl}
      />
      <AskQuestionDialog
        open={askOpen}
        onOpenChange={setAskOpen}
        pageUrl={pageUrl}
      />
    </>
  );
}
