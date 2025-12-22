import { Search, Pencil, Trash2 } from "lucide-react";
import SearchInput from "./search";
import { IMenu } from "@/app/types";
import { getCookies } from "@/lib/server-cookie";
import { BASE_API_URL, BASE_SUPABASE_URL } from "@/global";
import { get } from "@/lib/api-bridge";
import Image from "next/image";
import FilterJenis from "@/components/filter-menu";
import AddMenuModal from "./addMenu";

const getMenu = async (search: string, jenis: string): Promise<IMenu[]> => {
  try {
    const TOKEN = await getCookies("token");
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (jenis && jenis !== "all") params.set("jenis", jenis);

    const url = `${BASE_API_URL}/menu/get?${params.toString()}`;

    const { data } = await get(url, TOKEN);

    let result: IMenu[] = [];
    if (data?.status) result = [...data.data];

    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const MenuPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const search = searchParams.search?.toString() ?? "";
  const jenis = searchParams.jenis?.toString() ?? "all";

  const menu: IMenu[] = await getMenu(search, jenis);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Kelola menu makanan dan minuman dari kantin anda.
        </p>

        <AddMenuModal />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 rounded-2xl bg-white p-4 shadow">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <SearchInput url="/stan/menu" search={search} />
        </div>

        <FilterJenis />
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow">
        {/* wrapper biar bisa scroll di mobile */}
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-4 font-medium">Menu</th>
                <th className="px-6 py-4 font-medium">Deskripsi</th>
                <th className="px-6 py-4 font-medium">Jenis</th>
                <th className="px-6 py-4 font-medium">Harga</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {menu.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-muted-foreground"
                  >
                    Menu tidak ditemukan
                  </td>
                </tr>
              ) : (
                menu.map((menu) => (
                  <tr key={menu.id} className="border-t">
                    {/* Menu */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-200 shrink-0">
                          {menu.foto && (
                            <Image
                              src={`${BASE_SUPABASE_URL}/storage/v1/object/public/menu/${menu.foto}`}
                              alt={menu.nama_menu}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          )}
                        </div>

                        <p className="font-medium">{menu.nama_menu}</p>
                      </div>
                    </td>

                    {/* Deskripsi */}
                    <td className="px-6 py-4 max-w-xs">
                      <p className="line-clamp-2 text-muted-foreground text-sm">
                        {menu.deskripsi || "-"}
                      </p>
                    </td>

                    {/* Jenis */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          menu.jenis === "MAKANAN"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {menu.jenis}
                      </span>
                    </td>

                    {/* Harga */}
                    <td className="px-6 py-4">
                      Rp. {menu.harga.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Tersedia
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Pencil size={18} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default MenuPage;
