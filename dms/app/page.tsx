'use client';

import { useCallback, useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import SearchBar from '@/components/SearchBar';
import UploadButton from '@/components/UploadButton';
import CreateFolderButton from '@/components/CreateFolderButton';
import Table from '@/components/Table';
import EditModal from '@/components/EditModal';
import FilePreviewModal from '@/components/FilePreviewModal';
import { useItems } from '@/hooks/useItems';
import { itemsApi } from '@/services/items.api';
import { filesApi } from '@/services/files.api';
import type { BreadcrumbEntry, Item, SortEntry } from '@/types/item';

const CREATED_BY = 'system';

function sortToString(entries: SortEntry[]): string | undefined {
  if (entries.length === 0) return undefined;
  return entries.map(e => `${e.field}:${e.order}`).join(',');
}

export default function Home() {
  const [parentId, setParentId] = useState<number | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbEntry[]>([
    { id: null, name: 'Documents' },
  ]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortEntries, setSortEntries] = useState<SortEntry[]>([]);
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [previewItem, setPreviewItem] = useState<Item | null>(null);

  const { items, loading, error, refresh } = useItems({
    parentId,
    page,
    limit,
    sort: sortToString(sortEntries),
    search,
  });

  const handleFolderClick = useCallback((item: Item) => {
    setParentId(item.id);
    setBreadcrumbs(prev => [...prev, { id: item.id, name: item.name }]);
    setPage(1);
  }, []);

  const handleNavigate = useCallback((id: number | null) => {
    setParentId(id);
    setBreadcrumbs(prev => {
      const idx = prev.findIndex(b => b.id === id);
      return idx >= 0 ? prev.slice(0, idx + 1) : prev;
    });
    setPage(1);
  }, []);

  const handleSort = useCallback((field: string) => {
    setSortEntries(prev => {
      const existing = prev.find(s => s.field === field);
      if (!existing) return [...prev, { field, order: 'asc' }];
      if (existing.order === 'asc') return prev.map(s => s.field === field ? { ...s, order: 'desc' } : s);
      return prev.filter(s => s.field !== field);
    });
    setPage(1);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleUpload = useCallback(
    async (files: File[]) => {
      await filesApi.upload(files, parentId, CREATED_BY);
      refresh();
    },
    [parentId, refresh],
  );

  const handleCreateFolder = useCallback(
    async (name: string) => {
      await itemsApi.createFolder(name, parentId, CREATED_BY);
      refresh();
    },
    [parentId, refresh],
  );

  const handleEditSave = useCallback(
    async (name: string, file?: File) => {
      if (!editingItem) return;
      if (file) {
        await filesApi.replace(editingItem.id, file);
      } else {
        await itemsApi.rename(editingItem.id, name);
      }
      setEditingItem(null);
      refresh();
    },
    [editingItem, refresh],
  );

  return (
    <div className="min-h-screen bg-gray-100 px-6 pb-6 pt-10">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-start justify-between gap-4">
          <Breadcrumbs breadcrumbs={breadcrumbs} onNavigate={handleNavigate} />
          <div className="flex items-start gap-2">
            <UploadButton onUpload={handleUpload} disabled={!!search} />
            <CreateFolderButton onCreate={handleCreateFolder} disabled={!!search} />
          </div>
        </div>

        <div>
          <SearchBar onSearch={handleSearch} />
        </div>

        <Table
          items={items}
          loading={loading}
          error={error}
          sortEntries={sortEntries}
          onSort={handleSort}
          onFolderClick={handleFolderClick}
          onFileClick={setPreviewItem}
          onEdit={setEditingItem}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />

        {previewItem && (
          <FilePreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
        )}

        {editingItem && (
          <EditModal
            item={editingItem}
            onSave={handleEditSave}
            onClose={() => setEditingItem(null)}
          />
        )}
      </div>
    </div>
  );
}
