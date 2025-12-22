"use client";

import { useRouter, useSearchParams } from "next/navigation";

function FilterJenis() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentJenis = searchParams.get("jenis") ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const jenis = e.target.value;
    const params = new URLSearchParams();

    if (currentSearch) params.set("search", currentSearch);
    if (jenis !== "all") params.set("jenis", jenis);

    router.push(`/stan/menu?${params.toString()}`);
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
