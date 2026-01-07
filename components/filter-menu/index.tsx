"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  basePath: string;
}

function FilterJenis({ basePath }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentJenis = searchParams.get("jenis") ?? "";
  const currentStatus = searchParams.get("is_active") ?? "all";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const jenis = e.target.value;
    const params = new URLSearchParams();

    if (currentSearch) params.set("search", currentSearch);
    if (currentStatus && currentJenis !== "all") {
      params.set("is_active", currentStatus);
    }

    if (jenis !== "all") params.set("jenis", jenis);

    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <select
      value={currentJenis}
      onChange={handleChange}
      className="w-full sm:w-auto rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
      <option value="all">Semua</option>
      <option value="MAKANAN">Makanan</option>
      <option value="MINUMAN">Minuman</option>
    </select>
  );
}

export default FilterJenis;
