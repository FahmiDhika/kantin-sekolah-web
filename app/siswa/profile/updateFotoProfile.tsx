"use client";

import Image from "next/image";
import { useState, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { BASE_API_URL, BASE_SUPABASE_URL } from "@/global";
import { getCookie } from "@/lib/client-cookie";
import { put } from "@/lib/api-bridge";
import Modal from "@/components/modal";
import avatarDefault from "@/public/avatar-default.svg";

interface Props {
  fotoLama?: string | null;
}

const UpdateFotoProfile = ({ fotoLama }: Props) => {
  const [isShow, setIsShow] = useState(false);
  const [fotoProfil, setFotoProfil] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (isShow) {
      setPreviewFoto(
        fotoLama
          ? `${BASE_SUPABASE_URL}/storage/v1/object/public/siswa/${fotoLama}`
          : avatarDefault
      );
      setFotoProfil(null);
    }
  }, [isShow, fotoLama]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // validasi tipe file
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    setFotoProfil(file);
    setPreviewFoto(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fotoProfil) {
      toast.error("Pilih foto terlebih dahulu");
      return;
    }

    try {
      setLoading(true);

      const TOKEN = await getCookie("token");
      if (!TOKEN) return null;

      const url = `${BASE_API_URL}/user/updateSiswa`;

      const payload = new FormData();
      payload.append("foto", fotoProfil);

      const { data } = await put(url, payload, TOKEN);

      if (data?.status) {
        setIsShow(false);
        toast(data?.message, {
          hideProgressBar: false,
          containerId: `toastProfile`,
          type: `success`,
        });
        setTimeout(() => router.refresh(), 1000);
      } else {
        toast(data?.message, {
          hideProgressBar: false,
          containerId: `toastProfile`,
          type: `warning`,
        });
      }
    } catch (error) {
      console.error(error);
      toast("Terjadi kesalahan", {
        hideProgressBar: false,
        containerId: "toastProfile",
        type: "error",
      });
    }
  };

  return (
    <>
      <button
        onClick={() => setIsShow(true)}
        className="rounded-lg px-6 py-2 font-semibold bg-orange-500 text-white hover:bg-orange-600"
      >
        Ganti Foto Profil
      </button>

      <Modal
        open={isShow}
        onClose={() => setIsShow(false)}
        title="Ganti Foto Profil"
      >
        <form onSubmit={handleSubmit}>
          {/* PREVIEW FOTO */}
          <div className="flex justify-center">
            <Image
              src={previewFoto || avatarDefault}
              alt={avatarDefault}
              width={120}
              height={120}
              className="rounded-full object-cover aspect-square border"
            />
          </div>

          {/* INPUT FILE */}
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="w-full text-sm"
          />

          {/* ACTION */}
          <div className="mt-6 flex justify-between border-t pt-4">
            <button
              type="button"
              onClick={() => setIsShow(false)}
              className="rounded-lg border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg px-6 py-2 font-semibold text-white bg-orange-500 hover:bg-orange-600"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UpdateFotoProfile;
