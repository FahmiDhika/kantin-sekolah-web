"use client";

import { FormEvent, useState } from "react";
import { BASE_API_URL } from "@/global";
import { put } from "@/lib/api-bridge";
import { getCookie, storeCookie } from "@/lib/client-cookie";
import { toast } from "react-toastify";
import { ISiswaLogin } from "@/app/types";
import { useRouter } from "next/navigation";
import { CancelButton, SubmitButton } from "@/components/button";

interface Props {
  siswa: ISiswaLogin;
}

const ProfileSiswaClient = ({ siswa }: Props) => {
  const [edit, setEdit] = useState(false);
  const [nama, setNama] = useState(siswa.nama);
  const [alamat, setAlamat] = useState(siswa.alamat);
  const [telepon, setTelepon] = useState(siswa.telepon);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const TOKEN = getCookie("token");
      if (!TOKEN) return toast.error("Token tidak ditemukan");

      const url = `${BASE_API_URL}/user/updateSiswa`;

      const payload = new FormData();
      payload.append("nama", nama);
      payload.append("alamat", alamat);
      payload.append("telepon", telepon);

      const { data } = await put(url, payload, TOKEN);

      if (data?.status) {
        toast(data?.message, {
          hideProgressBar: false,
          containerId: "toastProfile",
          type: "success",
        });
        setEdit(false);
        setTimeout(() => router.refresh(), 1000);
        storeCookie("nama", nama);
      } else {
        toast(data?.message, {
          hideProgressBar: false,
          containerId: "toastProfile",
          type: "warning",
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
    <div className="space-y-6 py-6">
      <h1 className="text-xl font-semibold mb-2">Data Siswa</h1>

      <div>
        <label className="mb-1 block text-sm font-medium">Nama Siswa</label>
        <input
          disabled={!edit}
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary disabled:bg-gray-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Telepon Siswa</label>
        <input
          disabled={!edit}
          value={telepon}
          onChange={(e) => setTelepon(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary disabled:bg-gray-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Alamat Siswa</label>
        <input
          disabled={!edit}
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary disabled:bg-gray-100"
        />
      </div>

      <div className="flex justify-between border-t pt-4">
        {!edit ? (
          <button
            onClick={() => setEdit(true)}
            className="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
          >
            Edit Stan
          </button>
        ) : (
          <>
            <CancelButton onClick={() => setEdit(false)} type="button" />

            <SubmitButton onClick={handleSubmit} label="Simpan" />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSiswaClient;
