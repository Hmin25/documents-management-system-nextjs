'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { itemNameSchema } from '@/lib/schemas';
import type { Item } from '@/types/item';

type Props = {
  item: Item;
  onSave: (name: string, file?: File) => Promise<void>;
  onClose: () => void;
};

function validateName(value: string): string | null {
  const result = itemNameSchema.safeParse(value);
  return result.success ? null : result.error.issues[0].message;
}

export default function EditModal({ item, onSave, onClose }: Props) {
  const [name, setName] = useState(item.name);
  const [nameError, setNameError] = useState<string | null>(null);
  const [file, setFile] = useState<File | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isReplacing = !!file;

  const handleNameChange = (value: string) => {
    setName(value);
    setNameError(validateName(value));
  };

  const handleSubmit = async () => {
    if (!isReplacing) {
      const err = validateName(name);
      if (err) { setNameError(err); return; }
    }
    setSubmitting(true);
    try {
      await onSave(name.trim(), file);
      toast.success('Changes saved.');
    } catch {
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const nameUnchanged = !isReplacing && name.trim() === item.name;
  const isInvalid = !isReplacing && !!validateName(name);
  const canSave = !isInvalid && !nameUnchanged && !submitting;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
        <h2 className="text-base font-semibold mb-4">
          Edit {item.type === 'folder' ? 'Folder' : 'File'}
        </h2>

        {/* Rename section — locked when replacing */}
        <label className="text-xs text-gray-600 mb-1 block">
          Name {!isReplacing && <span className="text-red-500">*</span>}
        </label>
        <input
          type="text"
          value={isReplacing ? file!.name : name}
          onChange={e => !isReplacing && handleNameChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && canSave && handleSubmit()}
          maxLength={255}
          disabled={isReplacing}
          autoFocus={!isReplacing}
          placeholder="Item name"
          className={`w-full border rounded px-3 py-2 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            isReplacing
              ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200'
              : nameError
              ? 'border-red-400'
              : 'border-gray-300'
          }`}
        />

        {!isReplacing && nameError && (
          <p className="text-xs text-red-500 mb-3">{nameError}</p>
        )}
        {!isReplacing && !nameError && nameUnchanged && (
          <p className="text-xs text-amber-500 mb-3">No changes detected.</p>
        )}
        {(isReplacing || (!nameError && !nameUnchanged)) && <div className="mb-3" />}

        {/* Replace file section — files only */}
        {item.type === 'file' && (
          <div className="mb-4">
            <label className="text-xs text-gray-600 mb-2 block">Replace file (optional)</label>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                setFile(f);
                if (!f) setNameError(validateName(name));
              }}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="text-sm text-blue-600 hover:underline cursor-pointer"
              >
                {file ? 'Change file' : 'Choose file...'}
              </button>
              {file && (
                <button
                  onClick={() => setFile(undefined)}
                  className="text-xs text-gray-400 hover:text-red-500 cursor-pointer"
                >
                  ✕ Remove
                </button>
              )}
            </div>
            {isReplacing && (
              <p className="text-xs text-blue-600 mt-1">
                Name will be set to: <span className="font-medium">{file!.name}</span>
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSave}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
