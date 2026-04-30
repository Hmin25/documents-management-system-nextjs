'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  onUpload: (files: File[]) => Promise<void>;
  disabled?: boolean;
};

export default function UploadButton({ onUpload, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';

    if (files.length === 0) return;

    // ✅ validation FIRST
    for (const file of files) {
      if (file.size === 0) {
        toast.error(`"${file.name}" is empty.`);
        return;
      }

      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['pdf', 'txt'].includes(ext ?? '')) {
        toast.error(`"${file.name}" is not supported. Only PDF and TXT allowed.`);
        return;
      }
    }

    setUploading(true);

    try {
      await onUpload(files);
      toast.success(`${files.length} file(s) uploaded successfully.`);
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.txt"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading || disabled}
        className="flex items-center gap-2 px-6 py-1.5 bg-white text-blue-900 text-sm font-bold rounded-lg border border-blue-900 hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : <><span>↑</span> Upload files</>}
      </button>
    </>
  );
}