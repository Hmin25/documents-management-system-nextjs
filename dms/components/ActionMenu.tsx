'use client';

import { useEffect, useRef, useState } from 'react';
import type { Item } from '@/types/item';

type Props = {
  item: Item;
  onEdit: (item: Item) => void;
};

export default function ActionMenu({ item, onEdit }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="p-1 rounded hover:bg-gray-200 text-gray-700 font-bold leading-none cursor-pointer"
      >
        ···
      </button>
      {open && (
        <div className="absolute right-0 top-7 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[120px]">
          <button
            onClick={() => {
              onEdit(item);
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            ✏️ Edit
          </button>
        </div>
      )}
    </div>
  );
}
