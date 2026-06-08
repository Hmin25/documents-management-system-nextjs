/* eslint-disable react-hooks/preserve-manual-memoization */
'use client';

import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import SearchBar from '@/components/SearchBar';
import UploadButton from '@/components/UploadButton';
import CreateFolderButton from '@/components/CreateFolderButton';
import Table from '@/components/Table';
import EditModal from '@/components/EditModal';
import FilePreviewModal from '@/components/FilePreviewModal';
import { useFolderPath } from '@/hooks/useFolderPath';
import { useItems } from '@/hooks/useItems';
import {
  buildDocumentsHref,
  parseDocumentsQuery,
  sortToString,
  toggleSort,
  type DocumentsQuery,
} from '@/lib/documentsUrl';
import { itemsApi } from '@/services/items.api';
import { filesApi } from '@/services/files.api';
import type { Item } from '@/types/item';

const CREATED_BY = 'system';

type Props = {
  folderPath: string[];
};

export default function DocumentsPage({ folderPath }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = parseDocumentsQuery(searchParams);
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

  const navigate = useCallback(
    (path: string[], nextQuery: Partial<DocumentsQuery>) => {
      router.push(buildDocumentsHref(path, { ...query, ...nextQuery }));
    },
    [router, query],
  );

  const getFolderHref = useCallback(
    (item: Item) => buildDocumentsHref([...folderPath, item.name], { ...query, page: 1 }),
    [folderPath, query],
  );

  const handleBreadcrumbHref = useCallback(
    (index: number) => buildDocumentsHref(folderPath.slice(0, index), { ...query, page: 1 }),
    [folderPath, query],
  );

  const handleSort = useCallback(
    (field: string) => {
      navigate(folderPath, { sortEntries: toggleSort(sortEntries, field), page: 1 });
    },
    [folderPath, sortEntries, navigate],
  );

  const handleSearch = useCallback(
    (value: string) => {
      navigate(folderPath, { search: value, page: 1 });
    },
    [folderPath, navigate],
  );

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

  const tableLoading = pathLoading || loading;
  const tableError = invalid ? 'Folder not found.' : error;

  return (
    <div className="min-h-screen bg-gray-100 px-6 pb-6 pt-10">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-start justify-between gap-4">
          <Breadcrumbs breadcrumbs={breadcrumbs} getHref={handleBreadcrumbHref} />
          <div className="flex items-start gap-2">
            <UploadButton onUpload={handleUpload} disabled={!!search || invalid} />
            <CreateFolderButton onCreate={handleCreateFolder} disabled={!!search || invalid} />
          </div>
        </div>

        <div>
          <SearchBar value={search} onSearch={handleSearch} />
        </div>

        <Table
          items={items}
          loading={tableLoading}
          error={tableError}
          sortEntries={sortEntries}
          onSort={handleSort}
          getFolderHref={getFolderHref}
          onFileClick={setPreviewItem}
          onEdit={setEditingItem}
          page={page}
          limit={limit}
          onPageChange={nextPage => navigate(folderPath, { page: nextPage })}
          onLimitChange={nextLimit => navigate(folderPath, { limit: nextLimit, page: 1 })}
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
