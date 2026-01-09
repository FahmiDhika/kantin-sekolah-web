"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Modal from "@/components/modal";
import { IMenu } from "@/app/types";
import { BASE_API_URL, BASE_SUPABASE_URL } from "@/global";
import { put } from "@/lib/api-bridge";
import { getCookie } from "@/lib/client-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { CancelButton, SubmitButton } from "@/components/button";

interface Props {
  menuData: IMenu;
}

export default function UpdateMenuModal({ menuData }: Props) {
  const [isShow, setIsShow] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [menu, setMenu] = useState<IMenu>(menuData);

  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const TOKEN = getCookie("token");

  useEffect(() => {
    setMenu(menuData);
    if (menuData.foto) {
      setPreview(`${BASE_SUPABASE_URL}/menu/${menuData.foto}`);
    }
  }, [menuData]);

  if (!TOKEN) return null;

  const openModal = () => {
    setPreview(
      menu.foto
        ? `${BASE_SUPABASE_URL}/storage/v1/object/public//menu/${menu.foto}`
        : null
    );
    setIsShow(true);
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
      const url = `${BASE_API_URL}/menu/update/${menu.id}`;

      const payload = new FormData();
      payload.append("nama_menu", menu.nama_menu);
      payload.append("deskripsi", menu.deskripsi);
      payload.append("jenis", menu.jenis);
      payload.append("harga", menu.harga.toString());
      if (file) payload.append("foto", file);

      const { data } = await put(url, payload, TOKEN);

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
      {/* Trigger */}
      <button onClick={openModal} className="text-blue-600 hover:text-blue-800">
        <Pencil size={18} />
      </button>

      <Modal open={isShow} onClose={closeModal} title="Update Menu">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Menu */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Nama Menu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={menu.nama_menu}
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
                value={menu.harga}
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
              value={menu.jenis}
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
              value={menu.deskripsi}
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
                    fill
                    className="object-cover"
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
            <CancelButton onClick={closeModal} type="button" />

            <SubmitButton
              type="submit"
              disabled={isDisabled}
              label="Update menu"
            />
          </div>
        </form>
      </Modal>
    </>
  );
}
