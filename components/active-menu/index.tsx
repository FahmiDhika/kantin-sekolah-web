"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  basePath: string;
}

function FilterStatus({ basePath }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentJenis = searchParams.get("jenis") ?? "";
  const currentStatus = searchParams.get("is_active") ?? "all";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const is_active = e.target.value;
    const params = new URLSearchParams();

    // pertahankan search
    if (currentSearch) params.set("search", currentSearch);

    // pertahankan jenis
    if (currentJenis && currentJenis !== "all") {
      params.set("jenis", currentJenis);
    }

    // status
    if (is_active !== "all") {
      params.set("is_active", is_active);
    }

    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className="w-full sm:w-auto rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
      <option value="all">Semua Status</option>
      <option value="true">Aktif</option>
      <option value="false">Nonaktif</option>
    </select>
  );
}

export default FilterStatus;
