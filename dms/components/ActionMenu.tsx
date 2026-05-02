'use client';

import Image from 'next/image';
import { Dropdown, DropdownItem } from 'flowbite-react';
import type { Item } from '@/types/item';

type Props = {
  item: Item;
  onEdit: (item: Item) => void;
};

export default function ActionMenu({ item, onEdit }: Props) {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      placement="bottom-end"
      label={
        <span className="p-1 rounded hover:bg-gray-200 text-gray-700 font-bold leading-none cursor-pointer">
          ···
        </span>
      }
    >
      <DropdownItem onClick={() => onEdit(item)}>
        <span className="flex items-center gap-2">
          <Image src="/edit-line.svg" alt="" width={16} height={16} className="w-4 h-4" />
          <span>Edit</span>
        </span>
      </DropdownItem>
    </Dropdown>
  );
}
