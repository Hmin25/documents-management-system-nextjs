import { useRouter, useSearchParams } from 'next/navigation';
import {
  buildDocumentsHref,
  parseDocumentsQuery,
  toggleSort,
  type DocumentsQuery,
} from '@/lib/documentsUrl';
import type { Item } from '@/types/item';

export function useDocumentsNavigation(folderPath: string[]) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = parseDocumentsQuery(searchParams);

  function navigate(path: string[], nextQuery: Partial<DocumentsQuery>) {
    router.push(buildDocumentsHref(path, { ...query, ...nextQuery }));
  }

  return {
    query,
    getFolderHref(item: Item) {
      return buildDocumentsHref([...folderPath, item.name], { ...query, page: 1 });
    },
    getBreadcrumbHref(index: number) {
      return buildDocumentsHref(folderPath.slice(0, index), { ...query, page: 1 });
    },
    setPage(page: number) {
      navigate(folderPath, { page });
    },
    setLimit(limit: number) {
      navigate(folderPath, { limit, page: 1 });
    },
    setSearch(search: string) {
      navigate(folderPath, { search, page: 1 });
    },
    setSort(field: string) {
      navigate(folderPath, { sortEntries: toggleSort(query.sortEntries, field), page: 1 });
    },
  };
}
