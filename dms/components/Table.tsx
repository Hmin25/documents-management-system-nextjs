'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import type { Item, SortEntry } from '@/types/item';
import ActionMenu from './ActionMenu';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  items: Item[];
  loading: boolean;
  error: string | null;
  sortEntries: SortEntry[];
  onSort: (field: string) => void;
  onFolderClick: (item: Item) => void;
  onFileClick: (item: Item) => void;
  onEdit: (item: Item) => void;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

const COLUMNS: { key: string; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'created_by', label: 'Created By' },
  { key: 'created_at', label: 'Date' },
  { key: 'file_size', label: 'File Size' },
];

function formatFileSize(bytes?: number): string {
  if (bytes == null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function Table({
  items,
  loading,
  error,
  sortEntries,
  onSort,
  onFolderClick,
  onFileClick,
  onEdit,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: Props) {
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => (a.type === b.type ? 0 : a.type === 'folder' ? -1 : 1)),
    [items],
  );

  const getSortIndicator = (field: string) => {
    const entry = sortEntries.find(s => s.field === field);
    if (!entry) return '';
    return entry.order === 'asc' ? ' ↑' : ' ↓';
  };

  const hasNextPage = items.length === limit;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto min-h-[360px]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0B2447] text-white">
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => onSort(col.key)}
                  className="px-4 py-3 text-left font-medium cursor-pointer select-none hover:bg-[#1e4570] transition-colors whitespace-nowrap"
                >
                  {col.label}
                  {getSortIndicator(col.key)}
                </th>
              ))}
              <th className="px-4 py-3 text-left font-medium w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-gray-100">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading && error && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && sortedItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                  No items found
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              sortedItems.map(item => (
                <tr
                  key={item.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    {item.type === 'folder' ? (
                      <button
                        onClick={() => onFolderClick(item)}
                        className="flex items-center gap-2 text-blue-600 font-semibold hover:underline cursor-pointer"
                      >
                        <Image
                          src="/folder-line.svg"
                          alt=""
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        <span>{item.name}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onFileClick(item)}
                        className="flex items-center gap-2 text-gray-800 font-semibold hover:text-blue-600 hover:underline cursor-pointer"
                      >
                        <Image
                          src="/file-line.svg"
                          alt=""
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        <span>{item.name}</span>
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{item.created_by}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {formatFileSize(item.file_size)}
                  </td>
                  <td className="px-4 py-3">
                    <ActionMenu item={item} onEdit={onEdit} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>Rows per page:</span>
          <Select
            value={String(limit)}
            onValueChange={v => {
              onLimitChange(Number(v));
              onPageChange(1);
            }}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 15, 20].map(n => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            ← Prev
          </Button>
          <span className="text-sm text-gray-700 px-1">Page {page}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage}
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}
