/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

type Props = {
  value: string;
  onSearch: (value: string) => void;
};

export default function SearchBar({ value, onSearch }: Props) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Sync URL → input when navigating back/forward
  useEffect(() => {
     
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setLocalValue(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearchRef.current(v), 400);
  }

  return (
    <Input
      type="text"
      value={localValue}
      onChange={handleChange}
      placeholder="Search files and folders..."
      className="w-72 text-[#0B2447]"
    />
  );
}
