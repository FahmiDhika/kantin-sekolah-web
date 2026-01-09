"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  url: string;
  search?: string;
}

export default function SearchInput({ url, search = "" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tanggal = searchParams.get("tanggal");
  const bulan = searchParams.get("bulan");
  const tahun = searchParams.get("tahun");
  const status = searchParams.get("status");

  const onSearch = (value: string) => {
    const params = new URLSearchParams();

    if (value) params.set("search", value);
    if (tanggal) params.set("tanggal", tanggal);
    if (bulan) params.set("bulan", bulan);
    if (tahun) params.set("tahun", tahun);
    if (status) params.set("status", status);

    router.push(`${url}?${params.toString()}`);
  };

  return (
    <input
      defaultValue={search}
      placeholder="Cari riwayat pesanan dari nama menu..."
      className="w-full rounded-xl border px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
