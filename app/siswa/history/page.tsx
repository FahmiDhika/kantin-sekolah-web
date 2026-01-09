import { IHistoryQuery, IHistoryTransaksi } from "@/app/types";
import { BASE_API_URL, BASE_SUPABASE_URL } from "@/global";
import { get } from "@/lib/api-bridge";
import { getCookies } from "@/lib/server-cookie";
import { toast } from "react-toastify";
import Image from "next/image";
import FilterTanggal from "./filterTanggal";
import SearchInput from "@/components/search";

const getHistory = async (
  params?: IHistoryQuery
): Promise<IHistoryTransaksi[]> => {
  try {
    const TOKEN = await getCookies("token");
    if (!TOKEN) {
      toast(`Token tidak ada`, {
        hideProgressBar: false,
        containerId: `toastHistory`,
        type: "warning",
      });
    }

    const query = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params)
            .filter(([v]) => v !== undefined && v !== "")
            .reduce((acc, [k, v]) => {
              acc[k] = String(v);
              return acc;
            }, {} as Record<string, string>)
        ).toString()
      : "";

    const url = `${BASE_API_URL}/order/history/siswa${query}`;

    const { data } = await get(url, TOKEN);

    let result: IHistoryTransaksi[] = [];
    if (data?.status) result = data.data;

    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const HistoryPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const params: IHistoryQuery = {
    ...(searchParams.search && { search: searchParams.search.toString() }),
    ...(searchParams.tanggal && { tanggal: searchParams.tanggal.toString() }),
    ...(searchParams.bulan && { bulan: searchParams.bulan.toString() }),
    ...(searchParams.tahun && { tahun: searchParams.tahun.toString() }),
  };

  const history: IHistoryTransaksi[] = await getHistory(params);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">Riwayat Pesanan</h1>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 rounded-2xl bg-white p-4 shadow">
        <SearchInput
          url="/siswa/history"
          search={searchParams.search?.toString() ?? ""}
          placeholder={"Cari riwayat pesanan dari nama menu..."}
          keepParams={["tanggal", "bulan", "tahun"]}
        />

        <FilterTanggal url="/siswa/history" />
      </div>

      {history.length === 0 && (
        <div className="flex flex-col items-center py-16 text-gray-500">
          <div className="text-5xl">🧾</div>
          <p className="mt-2">Belum ada riwayat pesanan</p>
        </div>
      )}

      {history.map((transaksi) => {
        const total = transaksi.detail_transaksi.reduce(
          (sum, d) => sum + Number(d.harga_total),
          0
        );

        return (
          <div
            key={transaksi.id}
            className="rounded-2xl border bg-white p-4 shadow-sm space-y-4"
          >
            {/* HEADER */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold">{transaksi.stan.nama_stan}</h2>
                <p className="text-xs text-gray-500">
                  {new Date(transaksi.tanggal).toLocaleString("id-ID")}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  transaksi.status === "SELESAI"
                    ? "bg-green-100 text-green-700"
                    : transaksi.status === "DIPROSES"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {transaksi.status}
              </span>
            </div>

            {/* MENU */}
            <div className="space-y-3">
              {transaksi.detail_transaksi.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={`${BASE_SUPABASE_URL}/storage/v1/object/public/menu/${item.menu.foto}`}
                      alt={item.menu.nama_menu}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {item.menu.nama_menu} × {item.jumlah}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {item.catatan || "Tanpa catatan"}
                    </p>
                  </div>

                  <p className="text-sm font-semibold">
                    Rp {Number(item.harga_total).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="flex justify-between border-t pt-3">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-lg font-bold text-orange-600">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryPage;
