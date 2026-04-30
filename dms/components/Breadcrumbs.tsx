'use client';

import type { BreadcrumbEntry } from '@/types/item';

type Props = {
  breadcrumbs: BreadcrumbEntry[];
  onNavigate: (id: number | null) => void;
};

export default function Breadcrumbs({ breadcrumbs, onNavigate }: Props) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-600">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <span key={crumb.id ?? 'root'} className="flex items-center gap-1">
            {index > 0 && <span className="text-gray-400 mx-1">/</span>}
            {isLast ? (
              <span
                className={`font-semibold text-gray-900 ${
                  crumb.id === null ? 'text-lg' : ''
                }`}
              >
                {crumb.name}
              </span>
            ) : (
              <button
                onClick={() => onNavigate(crumb.id)}
                className={`hover:text-blue-600 hover:underline cursor-pointer ${
                  crumb.id === null ? 'text-lg' : ''
                }`}
              >
                {crumb.name}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
