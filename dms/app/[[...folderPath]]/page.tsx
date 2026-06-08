import { Suspense } from 'react';
import DocumentsPage from '@/components/DocumentsPage';
import { parseFolderPath } from '@/lib/documentsUrl';

type Props = {
  params: Promise<{ folderPath?: string[] }>;
};

export default async function Page({ params }: Props) {
  const { folderPath } = await params;
  const parsedPath = parseFolderPath(folderPath);

  return (
    <Suspense fallback={<DocumentsPageFallback />}>
      <DocumentsPage folderPath={parsedPath} />
    </Suspense>
  );
}

function DocumentsPageFallback() {
  return (
    <div className="min-h-screen bg-gray-100 px-6 pb-6 pt-10">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-72 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-white rounded-lg shadow animate-pulse" />
      </div>
    </div>
  );
}
