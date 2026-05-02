'use client';

import { useEffect, useState } from 'react';
import { filesApi } from '@/services/files.api';
import type { Item } from '@/types/item';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type Props = {
  item: Item;
  onClose: () => void;
};

function isTxt(name: string) {
  return name.toLowerCase().endsWith('.txt');
}

export default function FilePreviewModal({ item, onClose }: Props) {
  const [textContent, setTextContent] = useState<string | null>(null);
  const [textError, setTextError] = useState(false);

  useEffect(() => {
    if (!isTxt(item.name)) return;
    fetch(filesApi.previewUrl(item.id))
      .then(res => {
        if (!res.ok) throw new Error();
        return res.text();
      })
      .then(setTextContent)
      .catch(() => setTextError(true));
  }, [item.id, item.name]);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 sm:max-w-4xl"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg">📄</span>
            <span className="text-sm font-semibold text-gray-800 truncate">{item.name}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded p-1 cursor-pointer transition-colors shrink-0"
            aria-label="Close preview"
          >
            ✕
          </button>
        </div>

        {isTxt(item.name) ? (
          <div className="flex-1 overflow-auto p-5">
            {textError ? (
              <p className="text-red-500 text-sm">Failed to load file content.</p>
            ) : textContent === null ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : (
              <pre className="text-sm text-gray-800 whitespace-pre-wrap break-words font-mono leading-relaxed">
                {textContent}
              </pre>
            )}
          </div>
        ) : (
          <iframe
            src={filesApi.previewUrl(item.id)}
            title={item.name}
            className="flex-1 w-full rounded-b-xl"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
