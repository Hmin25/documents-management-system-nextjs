'use client';

import Link from 'next/link';
import type { BreadcrumbEntry } from '@/types/item';

type Props = {
  breadcrumbs: BreadcrumbEntry[];
  getHref: (index: number) => string;
};

export default function Breadcrumbs({ breadcrumbs, getHref }: Props) {
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
              <Link
                href={getHref(index)}
                className={`hover:text-blue-600 hover:underline ${
                  crumb.id === null ? 'text-lg' : ''
                }`}
              >
                {crumb.name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
