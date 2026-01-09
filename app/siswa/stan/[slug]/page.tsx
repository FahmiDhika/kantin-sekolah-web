import { IMenu } from "@/app/types";
import { BASE_API_URL, BASE_SUPABASE_URL } from "@/global";
import { get } from "@/lib/api-bridge";
import { getCookies } from "@/lib/server-cookie";
import Image from "next/image";
import SearchInput from "@/components/search";
import FilterJenis from "@/components/filter-menu";
import FilterStatus from "@/components/active-menu";
import AddToCart from "./addToCart";

interface Props {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

interface IStan {
  id: number;
  nama_stan: string;
}

const getStan = async (slug: string): Promise<IStan | null> => {
  try {
    const TOKEN = await getCookies("token");

    const namaStanFromSlug = slug.split("-").slice(1).join(" ");

    const params = new URLSearchParams();
    params.set("search", namaStanFromSlug);

    const url = `${BASE_API_URL}/user/getStan?${params.toString()}`;

    const { data } = await get(url, TOKEN);

    if (data?.status && data.data.length > 0) {
      return data.data[0];
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getMenu = async (
  slug: string,
  search?: string,
  jenis?: string,
  is_active?: string
): Promise<IMenu[]> => {
  try {
    const idStan = Number(slug.split("-")[0]);
    const TOKEN = await getCookies("token");

    const params = new URLSearchParams();

    params.set("id_stan", idStan.toString());

    if (search) params.set("search", search);
    if (jenis && jenis !== "all") params.set("jenis", jenis);
    if (is_active && is_active !== "all") params.set("is_active", is_active);

    const url = `${BASE_API_URL}/menu/getKantin?${params.toString()}`;

    const { data } = await get(url, TOKEN);

    let result: IMenu[] = [];
    if (data?.status) result = [...data.data];

    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const DetailKantin = async ({ params, searchParams }: Props) => {
  const search = searchParams.search?.toString() ?? "";
  const jenis = searchParams.jenis?.toString() ?? "all";
  const is_active = searchParams.is_active?.toString() ?? "all";

  const stan = await getStan(params.slug);

  if (!stan) {
    return <div>Kantin tidak ditemukan</div>;
  }

  const menu = await getMenu(params.slug, search, jenis, is_active);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{stan.nama_stan}</h1>
      <p>Anda bisa memesan menu makanan dari kantin {stan.nama_stan}</p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 rounded-2xl bg-white p-4 shadow">
        <SearchInput
          url={`/siswa/stan/${params.slug}`}
          search={search}
          placeholder="Cari menu..."
          keepParams={["jenis", "status"]}
        />

        <FilterJenis basePath={`/siswa/stan/${params.slug}`} />
        <FilterStatus basePath={`/siswa/stan/${params.slug}`} />
      </div>

      {menu.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="text-5xl">🍽️</div>

          <h2 className="text-xl font-semibold">Menu tidak ditemukan</h2>

          {search ? (
            <p className="text-gray-500">
              Tidak ada menu dengan kata kunci{" "}
              <span className="font-semibold text-gray-700">“{search}”</span>
            </p>
          ) : (
            <p className="text-gray-500">Menu belum tersedia di kantin ini</p>
          )}

          <a
            href={`/siswa/stan/${params.slug}`}
            className="mt-4 inline-block rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition"
          >
            Lihat semua menu
          </a>
        </div>
      )}

      {menu.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {menu.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="relative aspect-square lg:aspect-4/3 w-full bg-gray-100 overflow-hidden">
                <Image
                  src={`${BASE_SUPABASE_URL}/storage/v1/object/public/menu/${item.foto}`}
                  alt={item.nama_menu}
                  fill
                  className="object-cover"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-18 bg-linear-to-t from-white via-white/80 to-transparent" />

                <span
                  className={`absolute top-2 left-2 rounded-full px-3 py-1 text-xs font-medium ${
                    item.jenis === "MAKANAN"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.jenis}
                </span>

                {item.is_diskon && (
                  <span className="absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-semibold bg-red-500 text-white">
                    {item.persentase}% OFF
                  </span>
                )}
              </div>

              <div className="p-2.5 space-y-1">
                <h2 className="font-semibold text-sm truncate">
                  {item.nama_menu}
                </h2>

                <p className="text-xs text-gray-500 line-clamp-2">
                  {item.deskripsi}
                </p>

                <div className="mt-2">
                  {item.is_diskon ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-orange-600">
                        Rp {item.harga_diskon}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        Rp {item.harga_asli}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-gray-800">
                      Rp {item.harga_asli}
                    </span>
                  )}
                </div>

                <AddToCart key={item.id} menu={item} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailKantin;
