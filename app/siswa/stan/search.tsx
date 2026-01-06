"use client";

import { useRouter } from "next/navigation";

export default function SearchInput({
  url,
  search,
}: {
  url: string;
  search: string;
}) {
  const router = useRouter();

  const onSearch = (value: string) => {
    const params = new URLSearchParams();

    if (value) params.set("search", value);

    router.push(`${url}?${params.toString()}`);
  };

  return (
    <input
      defaultValue={search}
      placeholder="Cari menu..."
      className="w-full rounded-xl border px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
