import { IStan } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { get } from "@/lib/api-bridge";
import { getCookies } from "@/lib/server-cookie";
import SearchInput from "@/components/search";
import Link from "next/link";

const getStan = async (search: string): Promise<IStan[]> => {
  try {
    const TOKEN = await getCookies("token");
    const params = new URLSearchParams();

    if (search) params.set("search", search);

    const url = `${BASE_API_URL}/user/getStan?${params.toString()}`;

    const { data } = await get(url, TOKEN);

    let result: IStan[] = [];
    if (data?.status) result = [...data.data];

    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const StanPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const search = searchParams.search?.toString() ?? "";

  const stan: IStan[] = await getStan(search);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Daftar Stan Aktif</h1>
      <p className="text-sm text-gray-500">
        Halaman ini menampilkan semua stan yang sedang aktif
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 rounded-2xl bg-white p-4 shadow">
        <SearchInput
          url="/siswa/stan"
          search={search}
          placeholder="Cari nama kantin..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stan.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                {item.nama_stan}
              </h2>

              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                Buka
              </span>
            </div>

            {/* Content */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Pemilik:</span>{" "}
                {item.nama_pemilik}
              </p>
              <p>
                <span className="font-medium">Telepon:</span> {item.telepon}
              </p>
            </div>

            {/* Action */}
            <div className="mt-4">
              <Link
                href={`/siswa/stan/${item.id}-${item.nama_stan
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <button className="w-full bg-orange-500 text-white py-2 rounded-lg">
                  Lihat Menu
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {stan.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Tidak ada stan aktif 😔
        </div>
      )}
    </div>
  );
};

export default StanPage;
