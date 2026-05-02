'use client';

import Image from 'next/image';
import type { Item } from '@/types/item';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Props = {
  item: Item;
  onEdit: (item: Item) => void;
};

export default function ActionMenu({ item, onEdit }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-1 rounded hover:bg-gray-200 text-gray-700 font-bold leading-none cursor-pointer">
        ···
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(item)}>
          <Image src="/edit-line.svg" alt="" width={16} height={16} className="w-4 h-4" />
          <span>Edit</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
