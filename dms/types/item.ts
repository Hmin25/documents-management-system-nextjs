export type Item = {
  id: number;
  name: string;
  type: 'file' | 'folder';
  created_by: string;
  created_at: string;
  file_size?: number;
};

export type ItemsResponse = {
  data: Item[];
  page: number;
  limit: number;
};

export type BreadcrumbEntry = {
  id: number | null;
  name: string;
};

export type SortEntry = {
  field: string;
  order: 'asc' | 'desc';
};
