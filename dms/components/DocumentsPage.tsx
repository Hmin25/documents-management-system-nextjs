'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import SearchBar from '@/components/SearchBar';
import UploadButton from '@/components/UploadButton';
import CreateFolderButton from '@/components/CreateFolderButton';
import Table from '@/components/Table';
import EditModal from '@/components/EditModal';
import FilePreviewModal from '@/components/FilePreviewModal';
import { useDocumentsNavigation } from '@/hooks/useDocumentsNavigation';
import { useFolderPath } from '@/hooks/useFolderPath';
import { useItems } from '@/hooks/useItems';
import { sortToString } from '@/lib/documentsUrl';
import { itemsApi } from '@/services/items.api';
import { filesApi } from '@/services/files.api';
import type { Item } from '@/types/item';

const CREATED_BY = 'system';

type Props = {
  folderPath: string[];
};

export default function DocumentsPage({ folderPath }: Props) {
  const { query, getFolderHref, getBreadcrumbHref, setPage, setLimit, setSearch, setSort } =
    useDocumentsNavigation(folderPath);
  const { page, limit, sortEntries, search } = query;

  const { breadcrumbs, parentId, loading: pathLoading, invalid } = useFolderPath(folderPath);

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [previewItem, setPreviewItem] = useState<Item | null>(null);

  const { items, loading, error, refresh } = useItems({
    parentId,
    page,
    limit,
    sort: sortToString(sortEntries),
    search,
    skip: pathLoading || invalid,
  });

  async function handleUpload(files: File[]) {
    await filesApi.upload(files, parentId, CREATED_BY);
    refresh();
  }

  async function handleCreateFolder(name: string) {
    await itemsApi.createFolder(name, parentId, CREATED_BY);
    refresh();
  }

  async function handleEditSave(name: string, file?: File) {
    if (!editingItem) return;
    if (file) {
      await filesApi.replace(editingItem.id, file);
    } else {
      await itemsApi.rename(editingItem.id, name);
    }
    setEditingItem(null);
    refresh();
  }

  const tableLoading = pathLoading || loading;
  const tableError = invalid ? 'Folder not found.' : error;

  return (
    <div className="min-h-screen bg-gray-100 px-6 pb-6 pt-10">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-start justify-between gap-4">
          <Breadcrumbs breadcrumbs={breadcrumbs} getHref={getBreadcrumbHref} />
          <div className="flex items-start gap-2">
            <UploadButton onUpload={handleUpload} disabled={!!search || invalid} />
            <CreateFolderButton onCreate={handleCreateFolder} disabled={!!search || invalid} />
          </div>
        </div>

        <div>
          <SearchBar value={search} onSearch={setSearch} />
        </div>

        <Table
          items={items}
          loading={tableLoading}
          error={tableError}
          sortEntries={sortEntries}
          onSort={setSort}
          getFolderHref={getFolderHref}
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
