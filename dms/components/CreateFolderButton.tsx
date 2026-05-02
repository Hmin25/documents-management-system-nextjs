'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { itemNameSchema } from '@/lib/schemas';
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
      handleClose();
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

      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#0B2447]">Create New Folder</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={name}
              onChange={e => handleChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !isInvalid && !submitting && handleSubmit()}
              placeholder="Folder name"
              maxLength={255}
              autoFocus
              aria-invalid={error ? true : undefined}
              className="text-[#0B2447]"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={handleClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isInvalid || submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {submitting ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
