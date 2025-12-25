"use client";

import { FormEvent, useRef, useState } from "react";
import Modal from "@/components/modal";
import { IMenu } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { post } from "@/lib/api-bridge";
import { getCookie } from "@/lib/client-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import Image from "next/image";

export default function AddMenuModal() {
  const [isShow, setIsShow] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const [menu, setMenu] = useState<IMenu>({
    id: 0,
    nama_menu: "",
    deskripsi: "",
    foto: "",
    harga: 0,
    jenis: "",
    is_active: true,
    id_stan: 0,
  });

  const TOKEN = getCookie("token");

  if (!TOKEN) {
    toast.error("Token tidak ditemukan, silakan login ulang", {
      hideProgressBar: false,
      containerId: "toastMenu",
      type: "warning",
    });
    return;
  }

  const openModal = () => {
    setMenu({
      id: 0,
      nama_menu: "",
      deskripsi: "",
      foto: "",
      harga: 0,
      jenis: "",
      id_stan: 0,
      is_active: true,
    });
    setFile(null);
    setIsShow(true);
    formRef.current?.reset();
  };

  const closeModal = () => {
    setIsShow(false);
    setFile(null);
    setPreview(null);
    formRef.current?.reset();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const url = `${BASE_API_URL}/menu/add`;

      const payload = new FormData();
      payload.append("nama_menu", menu.nama_menu);
      payload.append("deskripsi", menu.deskripsi);
      payload.append("jenis", menu.jenis);
      payload.append("harga", menu.harga.toString());
      if (file) payload.append("foto", file);

      const { data } = await post(url, payload, TOKEN);

      if (data?.status) {
        setIsShow(false);
        toast(data?.message, {
          hideProgressBar: false,
          containerId: `toastMenu`,
          type: `success`,
        });
        closeModal();
        setTimeout(() => router.refresh(), 1000);
      } else {
        toast(data?.message, {
          hideProgressBar: false,
          containerId: `toastMenu`,
          type: `warning`,
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

  const isDisabled = !menu.nama_menu || !menu.jenis || menu.harga <= 0;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-medium text-white shadow hover:bg-orange-600"
      >
        <Plus size={18} />
        Tambah Menu
      </button>

      {/* Modal */}
      <Modal open={isShow} onClose={closeModal} title="Tambah Menu">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Menu */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Nama Menu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary"
              required
              onChange={(e) => setMenu({ ...menu, nama_menu: e.target.value })}
            />
          </div>

          {/* Harga */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Harga <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                Rp
              </span>
              <input
                type="number"
                required
                className="w-full rounded-lg border py-2 pl-10 pr-3 focus:ring-2 focus:ring-primary"
                onChange={(e) =>
                  setMenu({ ...menu, harga: Number(e.target.value) })
                }
              />
            </div>
          </div>

          {/* Jenis */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Jenis <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full rounded-lg border px-3 py-2"
              required
              onChange={(e) => setMenu({ ...menu, jenis: e.target.value })}
            >
              <option value="">Pilih Jenis</option>
              <option value="MAKANAN">Makanan</option>
              <option value="MINUMAN">Minuman</option>
            </select>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="mb-1 block text-sm font-medium">Deskripsi</label>
            <textarea
              className="w-full rounded-lg border px-3 py-2"
              rows={3}
              onChange={(e) => setMenu({ ...menu, deskripsi: e.target.value })}
            />
          </div>

          {/* Foto */}
          <div>
            <label className="mb-1 block text-sm font-medium">Foto Menu</label>
            <div className="flex items-center justify-center">
              <div className="relative h-40 w-40 overflow-hidden rounded-xl border bg-gray-50">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview Menu"
                    className="w-full h-full text-center object-cover"
                    width={48}
                    height={48}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    Preview Foto
                  </div>
                )}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setFile(file);
                setPreview(URL.createObjectURL(file));
              }}
            />
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
              disabled={isDisabled}
              className={`rounded-lg px-6 py-2 font-semibold text-white ${
                isDisabled
                  ? "cursor-not-allowed bg-gray-300"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              Simpan Menu
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
