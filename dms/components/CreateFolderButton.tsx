'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { itemNameSchema } from '@/lib/schemas';

type Props = {
  onCreate: (name: string) => Promise<void>;
  disabled?: boolean;
};

function validate(value: string): string | null {
  const result = itemNameSchema.safeParse(value);
  return result.success ? null : result.error.issues[0].message;
}

export default function CreateFolderButton({ onCreate, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (value: string) => {
    setName(value);
    setError(validate(value));
  };

  const handleSubmit = async () => {
    const err = validate(name);
    if (err) { setError(err); return; }
    setSubmitting(true);
    try {
      const trimmed = name.trim();
      await onCreate(trimmed);
      toast.success(`Folder "${trimmed}" created.`);
      setName('');
      setError(null);
      setOpen(false);
    } catch {
      toast.error('Failed to create folder. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setError(null);
  };

  const isInvalid = !!validate(name);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="flex items-center gap-2 px-6 py-1.5 bg-[#2308B8] text-white text-sm font-medium rounded-lg hover:bg-[#1D0799] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        + Add new folder
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
            <h2 className="text-base font-semibold mb-4">Create New Folder</h2>

            <label className="text-xs text-gray-600 mb-1 block">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => handleChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !isInvalid && !submitting && handleSubmit()}
              placeholder="Folder name"
              maxLength={255}
              autoFocus
              className={`w-full border rounded px-3 py-2 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            {!error && <div className="mb-3" />}

            <div className="flex justify-end gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isInvalid || submitting}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
