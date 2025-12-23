"use client";

import { FormEvent, useState } from "react";
import Modal from "@/components/modal";
import { toast } from "react-toastify";
import { BASE_API_URL } from "@/global";
import { drop } from "@/lib/api-bridge";
import { getCookie } from "@/lib/client-cookie";
import { useRouter } from "next/navigation";
import { Unlink } from "lucide-react";
import { IMenu } from "@/app/types";

interface Props {
  id_diskon: number;
  menus: IMenu[];
}

const DetachDiskon = ({ id_diskon, menus }: Props) => {
  const [isShow, setIsShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMenus, setSelectedMenus] = useState<number[]>([]);
  const router = useRouter();

  const TOKEN = getCookie("token");
  if (!TOKEN) return null;

  const toggleMenu = (id: number) => {
    setSelectedMenus((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (selectedMenus.length === 0) {
      toast("Pilih menu yang akan dilepas diskonnya", {
        containerId: "toastDiskon",
        type: "warning",
      });
      return;
    }

    try {
      const url = `${BASE_API_URL}/diskon/lepas`;
      const payload = {
        id_diskon,
        id_menus: selectedMenus,
      };

      const { data } = await drop(url, TOKEN, payload);

      if (data?.status) {
        toast(data?.message, {
          hideProgressBar: false,
          containerId: "toastDiskon",
          type: "success",
        });
        setIsShow(false);
        setSelectedMenus([]);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        className="text-orange-600 hover:text-orange-800"
        onClick={() => setIsShow(true)}
      >
        <Unlink size={18} />
      </button>

      {/* Modal */}
      <Modal
        open={isShow}
        onClose={() => setIsShow(false)}
        title="Lepas Diskon"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm">Yakin ingin melepas diskon dari menu:</p>

          {/* List Menu */}
          <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border p-2">
            {menus.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Tidak ada menu yang memakai diskon ini
              </p>
            ) : (
              menus.map((menu) => {
                const checked = selectedMenus.includes(menu.id);

                return (
                  <label
                    key={menu.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition
                      ${
                        checked
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleMenu(menu.id)}
                      className="mt-1"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-medium">{menu.nama_menu}</p>

                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Rp {menu.harga.toLocaleString()}</span>

                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium
                            ${
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

          <div className="flex justify-between border-t pt-4">
            <button
              onClick={() => setIsShow(false)}
              className="rounded-lg border px-4 py-2 text-sm"
              disabled={loading}
            >
              Batal
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
            >
              {loading ? "Memproses..." : "Lepas Diskon"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DetachDiskon;
