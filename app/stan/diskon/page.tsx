"use server";

import { IDiskon } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { get } from "@/lib/api-bridge";
import { getCookies } from "@/lib/server-cookie";
import AddDiskonModal from "./addDiskon";
import UpdateDiskonModal from "./updateDiskon";
import DeleteDiskonModal from "./deleteDiskon";

const getDiskon = async (): Promise<IDiskon[]> => {
  try {
    const TOKEN = await getCookies("token");

    const url = `${BASE_API_URL}/diskon/all`;

    const { data } = await get(url, TOKEN);

    let result: IDiskon[] = [];
    if (data?.status) result = [...data.data];

    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getActiveDiskon = async (): Promise<IDiskon[]> => {
  try {
    const TOKEN = await getCookies("token");
    const url = `${BASE_API_URL}/diskon/active`;

    const { data } = await get(url, TOKEN);

    if (data?.status) return data.data;
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const filterDiskonByDate = (
  diskon: IDiskon[],
  start?: string,
  end?: string
) => {
  if (!start && !end) return diskon;

  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;

  return diskon.filter((d) => {
    const awal = new Date(d.tanggal_awal);
    const akhir = new Date(d.tanggal_akhir);

    if (startDate && akhir < startDate) return false;
    if (endDate && awal > endDate) return false;

    return true;
  });
};

const DiskonPage = async ({
  searchParams,
}: {
  searchParams?: {
    start?: string;
    end?: string;
  };
}) => {
  const diskonAll = await getDiskon();
  const activeDiskon = await getActiveDiskon();

  const diskon = filterDiskonByDate(
    diskonAll,
    searchParams?.start,
    searchParams?.end
  );

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Kelola diskon yang tersedia di stan anda.
        </p>

        <AddDiskonModal />
      </div>

      {/* Diskon Aktif */}
      <div className="rounded-2xl bg-white p-4 shadow">
        <h2 className="mb-2 text-sm font-semibold">Diskon Aktif Saat Ini</h2>

        {activeDiskon.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Tidak ada diskon yang aktif saat ini
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {activeDiskon.map((d) => (
              <span
                key={d.id}
                className="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700"
              >
                {d.nama_diskon} ({d.persentase}%)
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Filter Tanggal */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 rounded-2xl bg-white p-4 shadow">
        <form className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <input
            name="start"
            type="date"
            defaultValue={searchParams?.start}
            className="rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            name="end"
            type="date"
            defaultValue={searchParams?.end}
            className="rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            type="submit"
            className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-orange-600"
          >
            Terapkan
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-4 font-medium">No</th>
                <th className="px-6 py-4 font-medium">Nama Diskon</th>
                <th className="px-6 py-4 font-medium">Persentase</th>
                <th className="px-6 py-4 font-medium">Periode</th>
                <th className="px-6 py-4 font-medium">Menu</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {diskon.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-muted-foreground"
                  >
                    Diskon tidak ditemukan
                  </td>
                </tr>
              ) : (
                diskon.map((diskon, index) => (
                  <tr key={diskon.id} className="border-t">
                    {/* No */}
                    <td className="px-6 py-4">{index + 1}</td>

                    {/* Nama Diskon */}
                    <td className="px-6 py-4 font-medium">
                      {diskon.nama_diskon}
                    </td>

                    {/* Persentase */}
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                        {diskon.persentase}%
                      </span>
                    </td>

                    {/* Periode */}
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(diskon.tanggal_awal)} –{" "}
                      {formatDate(diskon.tanggal_akhir)}
                    </td>

                    {/* Menu */}
                    <td className="px-6 py-4 max-w-xs">
                      {diskon.menu_diskon && diskon.menu_diskon.length > 0 ? (
                        <ul className="space-y-1 text-sm">
                          {diskon.menu_diskon?.map((md) => (
                            <li key={md.id} className="line-clamp-1">
                              • {md.menu.nama_menu}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="italic text-muted-foreground text-red-600">
                          Tidak ada menu yang dipasang
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <UpdateDiskonModal diskonData={diskon} />
                        <DeleteDiskonModal selectedDiskon={diskon} />
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

export default DiskonPage;
