/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { itemsApi } from '@/services/items.api';
import type { BreadcrumbEntry } from '@/types/item';

const ROOT_CRUMB: BreadcrumbEntry = { id: null, name: 'Documents' };

type FolderPathState = {
  breadcrumbs: BreadcrumbEntry[];
  parentId: number | null;
  loading: boolean;
  invalid: boolean;
};

const initialState: FolderPathState = {
  breadcrumbs: [ROOT_CRUMB],
  parentId: null,
  loading: false,
  invalid: false,
};

export function useFolderPath(folderNames: string[]) {
  const [state, setState] = useState<FolderPathState>(initialState);
  const pathKey = folderNames.join('/');

  useEffect(() => {
    if (folderNames.length === 0) {
      setState({ ...initialState });
      return;
    }

    let cancelled = false;
    setState(prev => ({ ...prev, loading: true, invalid: false }));

    (async () => {
      const crumbs: BreadcrumbEntry[] = [ROOT_CRUMB];
      let parentId: number | null = null;

      for (const name of folderNames) {
        const res = await itemsApi.list({ parentId, page: 1, limit: 100 });
        const folder = res.data.find(item => item.type === 'folder' && item.name === name);
        if (!folder) {
          if (!cancelled) {
            setState({ breadcrumbs: [ROOT_CRUMB], parentId: null, loading: false, invalid: true });
          }
          return;
        }
        crumbs.push({ id: folder.id, name: folder.name });
        parentId = folder.id;
      }

      if (!cancelled) {
        setState({ breadcrumbs: crumbs, parentId, loading: false, invalid: false });
      }
    })().catch(() => {
      if (!cancelled) {
        setState({ breadcrumbs: [ROOT_CRUMB], parentId: null, loading: false, invalid: true });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [pathKey, folderNames]);

  return state;
}
