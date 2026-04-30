'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  onSearch: (value: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setValue(v);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onSearch(v), 400);
    },
    [onSearch],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="Search files and folders..."
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    />
  );
}
