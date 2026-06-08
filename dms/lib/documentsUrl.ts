import type { SortEntry } from '@/types/item';

export type DocumentsQuery = {
  page: number;
  limit: number;
  sortEntries: SortEntry[];
  search: string;
};

const DEFAULT_LIMIT = 10;
const ALLOWED_LIMITS = new Set([10, 15, 20]);

export function sortToString(entries: SortEntry[]): string | undefined {
  if (entries.length === 0) return undefined;
  return entries.map(e => `${e.field}:${e.order}`).join(',');
}

export function parseSortString(sort: string | null): SortEntry[] {
  if (!sort) return [];
  return sort
    .split(',')
    .map(part => {
      const [field, order] = part.split(':');
      if (!field || (order !== 'asc' && order !== 'desc')) return null;
      return { field, order } as SortEntry;
    })
    .filter((entry): entry is SortEntry => entry !== null);
}

export function parseFolderPath(segments: string[] | undefined): string[] {
  if (!segments?.length) return [];
  return segments.map(segment => decodeURIComponent(segment));
}

export function encodeFolderPath(folderPath: string[]): string {
  if (folderPath.length === 0) return '/';
  return `/${folderPath.map(segment => encodeURIComponent(segment)).join('/')}`;
}

export function parseDocumentsQuery(searchParams: URLSearchParams): DocumentsQuery {
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limitParam = Number(searchParams.get('limit'));
  const limit = ALLOWED_LIMITS.has(limitParam) ? limitParam : DEFAULT_LIMIT;

  return {
    page,
    limit,
    sortEntries: parseSortString(searchParams.get('sort')),
    search: searchParams.get('search') ?? '',
  };
}

export function buildDocumentsHref(
  folderPath: string[],
  query: Partial<DocumentsQuery> = {},
): string {
  const path = encodeFolderPath(folderPath);
  const params = new URLSearchParams();

  const page = query.page ?? 1;
  const limit = query.limit ?? DEFAULT_LIMIT;
  const sortEntries = query.sortEntries ?? [];
  const search = query.search ?? '';

  if (page > 1) params.set('page', String(page));
  if (limit !== DEFAULT_LIMIT) params.set('limit', String(limit));

  const sort = sortToString(sortEntries);
  if (sort) params.set('sort', sort);
  if (search) params.set('search', search);

  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

export function toggleSort(entries: SortEntry[], field: string): SortEntry[] {
  const existing = entries.find(s => s.field === field);
  if (!existing) return [...entries, { field, order: 'asc' }];
  if (existing.order === 'asc') {
    return entries.map(s => (s.field === field ? { ...s, order: 'desc' } : s));
  }
  return entries.filter(s => s.field !== field);
}
