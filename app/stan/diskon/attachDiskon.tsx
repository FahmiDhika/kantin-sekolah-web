"use client";

import { FormEvent, useEffect, useState } from "react";
import Modal from "@/components/modal";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { BASE_API_URL } from "@/global";
import { get, post } from "@/lib/api-bridge";
import { getCookie } from "@/lib/client-cookie";
import { IMenu } from "@/app/types";

export const getMenu = async (
  search: string,
  jenis: string,
  is_active: string
): Promise<IMenu[]> => {
  try {
    const TOKEN = await getCookie("token");
    if (!TOKEN) return [];
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (jenis && jenis !== "all") params.set("jenis", jenis);
    if (is_active && is_active !== "all") params.set(`is_active`, is_active);

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

const AttachDiskon = ({
  id_diskon,
  usedMenuIds,
}: {
  id_diskon: number;
  usedMenuIds: number[];
}) => {
  const [isShow, setIsShow] = useState(false);
  const [selectedMenus, setSelectedMenus] = useState<number[]>([]);

  const [menus, setMenus] = useState<IMenu[]>([]);
  const [search, setSearch] = useState("");
  const [jenis, setJenis] = useState("all");
  const [isActive, setIsActive] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isShow) return;

    const loadMenu = async () => {
      setLoading(true);
      const result = await getMenu(search, jenis, isActive);
      setMenus(result);
      setLoading(false);
    };

    loadMenu();
  }, [isShow, search, jenis, isActive]);

  const router = useRouter();

  const toggleMenu = (id_menu: number) => {
    setSelectedMenus((prev) =>
      prev.includes(id_menu)
        ? prev.filter((id) => id !== id_menu)
        : [...prev, id_menu]
    );
  };

  const TOKEN = getCookie("token");
  if (!TOKEN) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!id_diskon || selectedMenus.length === 0) {
      toast("Pilih menu terlebih dahulu", {
        hideProgressBar: false,
        containerId: "toastDiskon",
        type: "warning",
      });
      return;
    }

    try {
      const url = `${BASE_API_URL}/diskon/pasang`;
      const payload = {
        id_diskon: id_diskon,
        id_menus: selectedMenus,
      };

      const { data } = await post(url, payload, TOKEN);

      if (data?.status) {
        setIsShow(false);
        setSelectedMenus([]);
        toast(data?.message, {
          hideProgressBar: false,
          containerId: "toastDiskon",
          type: "success",
        });
        setTimeout(() => router.refresh(), 1000);
      } else {
        toast(data?.message, {
          hideProgressBar: false,
          containerId: "toastDiskon",
          type: "warning",
        });
      }
    } catch (error) {
      console.error(error);
      toast("Terjadi kesalahan", {
        hideProgressBar: false,
        containerId: "toastDiskon",
        type: "error",
      });
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setIsShow(true)}
        className="rounded-md bg-white px-3 py-1 text-sm font-medium text-green-700 shadow-sm hover:bg-green-50"
      >
        Pasang ke Menu
      </button>

      {/* Modal */}
      <Modal
        open={isShow}
        onClose={() => setIsShow(false)}
        title="Pasang Diskon ke Menu"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Menu yang sudah memiliki diskon atau tidak dijual tidak bisa dipilih
          </p>

          {/* Search */}
          <input
            type="text"
            placeholder="Cari menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />

          {/* Filter */}
          <div className="flex gap-2">
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
              className="rounded-md border px-2 py-1 text-sm"
            >
              <option value="all">Semua Jenis</option>
              <option value="MAKANAN">Makanan</option>
              <option value="MINUMAN">Minuman</option>
            </select>

            <select
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
              className="rounded-md border px-2 py-1 text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="true">Tersedia</option>
              <option value="false">Tidak Dijual</option>
            </select>
          </div>

          {/* List Menu */}
          <div className="max-h-64 overflow-y-auto rounded-md border p-2 space-y-2">
            {loading ? (
              <p className="text-sm text-muted-foreground">Memuat menu...</p>
            ) : menus.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Menu tidak ditemukan
              </p>
            ) : (
              menus.map((menu) => {
                const checked = selectedMenus.includes(menu.id);
                const alreadyUsed = usedMenuIds.includes(menu.id);
                const disabled = !menu.is_active || alreadyUsed;

                return (
                  <label
                    key={menu.id}
                    className={`flex items-start gap-3 rounded-lg border p-3 transition ${
                      checked
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    } ${
                      disabled
                        ? "cursor-not-allowed bg-gray-50 opacity-60"
                        : "cursor-pointer hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggleMenu(menu.id)}
                      className="mt-1"
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{menu.nama_menu}</p>

                        <div className="flex gap-2">
                          {!menu.is_active && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                              Tidak Dijual
                            </span>
                          )}

                          {alreadyUsed && (
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                              Sudah Ada Diskon
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Rp {menu.harga.toLocaleString()}</span>

                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            menu.jenis === "MAKANAN"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {menu.jenis}
                        </span>
                      </div>
                    </div>
                  </label>
                );
              })
            )}
          </div>

          {/* Action */}
          <div className="mt-6 flex justify-between border-t pt-4">
            {/* Batal */}
            <button
              type="button"
              onClick={() => setIsShow(false)}
              className="rounded-lg border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50"
            >
              Batal
            </button>

            {/* Simpan */}
            <button
              type="submit"
              className={`rounded-lg px-6 py-2 font-semibold text-white
                  bg-orange-500 hover:bg-orange-600
              `}
            >
              Simpan Diskon
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AttachDiskon;
