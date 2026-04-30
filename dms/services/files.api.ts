import { API_BASE, request } from './api';
import type { Item } from '@/types/item';

export function upload(
  files: File[],
  parentId: number | null,
  createdBy: string
): Promise<Item[]> {
  const form = new FormData();

  files.forEach((file) => {
    form.append('files', file);
  });

  if (parentId !== null) form.append('parentId', String(parentId));
  form.append('createdBy', createdBy);

  return request<Item[]>('/files/upload', {
    method: 'POST',
    body: form,
  });
}

function replace(id: number, file: File): Promise<Item> {
  const form = new FormData();
  form.append('file', file);
  return request<Item>(`/files/${id}/replace`, { method: 'PUT', body: form });
}

function previewUrl(id: number): string {
  return `${API_BASE}/files/${id}/preview`;
}

export const filesApi = { upload, replace, previewUrl };
