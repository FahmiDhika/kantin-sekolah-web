"use client";

import { FormEvent, useState } from "react";
import Modal from "@/components/modal";
import { IMenu } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { drop } from "@/lib/api-bridge";
import { getCookie } from "@/lib/client-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Trash2, RotateCcw } from "lucide-react";

const ActiveMenuModal = ({ menuData }: { menuData: IMenu }) => {
  const [isShow, setIsShow] = useState(false);
  const [menu, setMenu] = useState<IMenu>(menuData);

  const router = useRouter();
  const TOKEN = getCookie("token");
  if (!TOKEN) return null;

  const openModal = () => {
    setMenu({ ...menuData });
    setIsShow(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      const url = `${BASE_API_URL}/menu/delete/${menuData.id}`;
      const { data } = await drop(url, TOKEN);

      if (data?.status) {
        setIsShow(false);
        toast(data?.message, {
          hideProgressBar: false,
          containerId: `toastMenu`,
          type: "success",
        });
        setTimeout(() => router.refresh(), 1000);
      } else {
        toast(data?.message, {
          hideProgressBar: false,
          containerId: `toastMenu`,
          type: "warning",
        });
      }
    } catch (error) {
      console.error(error);
      toast("Terjadi kesalahan", {
        hideProgressBar: false,
        containerId: "toastMenu",
        type: "error",
      });
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={openModal}
        className={
          menuData.is_active
            ? "text-red-600 hover:text-red-800"
            : "text-green-600 hover:text-green-800"
        }
      >
        {menuData.is_active ? <Trash2 size={18} /> : <RotateCcw size={18} />}
      </button>

      <Modal
        open={isShow}
        onClose={() => setIsShow(false)}
        title={menu.is_active ? "Nonaktifkan Menu" : "Aktifkan Menu"}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">
            {menu.is_active
              ? "Apakah kamu yakin ingin menonaktifkan menu:"
              : "Apakah kamu yakin ingin mengaktifkan kembali menu:"}
          </p>

          <div
            className={`rounded-md p-3 text-sm ${
              menu.is_active
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            <strong>{menu.nama_menu}</strong>
          </div>

          <p className="text-xs text-gray-500">
            {menu.is_active
              ? "Menu tidak akan tampil ke siswa."
              : "Menu akan kembali tersedia untuk siswa."}
          </p>

          <div className="mt-6 flex justify-between border-t pt-4">
            <button
              type="button"
              onClick={() => setIsShow(false)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Batal
            </button>

            <button
              type="submit"
              className={`px-4 py-2 text-sm rounded-lg text-white ${
                menu.is_active
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {menu.is_active ? "Nonaktifkan" : "Aktifkan"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ActiveMenuModal;
