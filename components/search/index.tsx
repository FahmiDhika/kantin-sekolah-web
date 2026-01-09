"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchInputProps {
  url: string;
  search?: string;
  placeholder?: string;
  keepParams?: string[];
}

export default function SearchInput({
  url,
  search = "",
  placeholder = "Cari...",
  keepParams = [],
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSearch = (value: string) => {
    const params = new URLSearchParams();

    if (value) params.set("search", value);

    // pertahankan query lain
    keepParams.forEach((key) => {
      const val = searchParams.get(key);
      if (val) params.set(key, val);
    });

    router.push(`${url}?${params.toString()}`);
  };

  return (
    <div className="relative flex-1">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={18}
      />
      <input
        defaultValue={search}
        placeholder={placeholder}
        className="w-full rounded-xl border px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
