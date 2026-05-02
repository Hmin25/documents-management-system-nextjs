'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { itemNameSchema } from '@/lib/schemas';
import type { Item } from '@/types/item';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[#0B2447]">
            Edit {item.type === 'folder' ? 'Folder' : 'File'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              Name {!isReplacing && <span className="text-red-500">*</span>}
            </label>
            <Input
              type="text"
              value={isReplacing ? file!.name : name}
              onChange={e => !isReplacing && handleNameChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && canSave && handleSubmit()}
              maxLength={255}
              disabled={isReplacing}
              autoFocus={!isReplacing}
              placeholder="Item name"
              aria-invalid={nameError ? true : undefined}
              className="text-[#0B2447]"
            />
            {!isReplacing && nameError && (
              <p className="text-xs text-red-500 mt-1">{nameError}</p>
            )}
            {!isReplacing && !nameError && nameUnchanged && (
              <p className="text-xs text-amber-500 mt-1">No changes detected.</p>
            )}
          </div>

          {item.type === 'file' && (
            <div>
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
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
