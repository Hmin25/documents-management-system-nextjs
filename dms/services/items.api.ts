import { request } from './api';
import type { Item, ItemsResponse } from '@/types/item';

export type GetItemsParams = {
  parentId: number | null;
  page: number;
  limit: number;
  sort?: string;
  search?: string;
};

function list(params: GetItemsParams): Promise<ItemsResponse> {
  const query = new URLSearchParams();
  if (params.parentId !== null) query.set('parentId', String(params.parentId));
  query.set('page', String(params.page));
  query.set('limit', String(params.limit));
  if (params.sort) query.set('sort', params.sort);
  if (params.search) query.set('search', params.search);
  return request<ItemsResponse>(`/items?${query}`);
}

function rename(id: number, name: string): Promise<Item> {
  return request<Item>(`/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
}

function createFolder(name: string, parentId: number | null, createdBy: string): Promise<Item> {
  return request<Item>('/folders', {
    method: 'POST',
    body: JSON.stringify({ name, parentId, createdBy }),
  });
}

export const itemsApi = { list, rename, createFolder };
