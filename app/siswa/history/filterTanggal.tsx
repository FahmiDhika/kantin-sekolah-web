"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function FilterTanggal({ url }: { url: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search");

  const onChangeTanggal = (value: string) => {
    const params = new URLSearchParams();

    // pertahankan filter lain
    if (search) params.set("search", search);

    if (value) {
      const date = new Date(value);

      params.set("tanggal", String(date.getDate()));
      params.set("bulan", String(date.getMonth() + 1));
      params.set("tahun", String(date.getFullYear()));
    } else {
      // kalau dihapus
      params.delete("tanggal");
      params.delete("bulan");
      params.delete("tahun");
    }

    router.push(`${url}?${params.toString()}`);
  };

  return (
    <input
      type="date"
      onChange={(e) => onChangeTanggal(e.target.value)}
      className="rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
    />
  );
}
