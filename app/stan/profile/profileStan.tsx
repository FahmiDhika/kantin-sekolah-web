"use client";

import { useState } from "react";
import { BASE_API_URL } from "@/global";
import { put } from "@/lib/api-bridge";
import { getCookie, storeCookie } from "@/lib/client-cookie";
import { toast } from "react-toastify";
import { IStanLogin } from "@/app/types";
import { CancelButton, SubmitButton } from "@/components/button";

interface Props {
  stan: IStanLogin;
}

const ProfileStanClient = ({ stan }: Props) => {
  const [edit, setEdit] = useState(false);
  const [namaStan, setNamaStan] = useState(stan.nama_stan);
  const [namaPemilik, setNamaPemilik] = useState(stan.nama_pemilik);
  const [telepon, setTelepon] = useState(stan.telepon);

  const handleSubmit = async () => {
    try {
      const TOKEN = getCookie("token");
      if (!TOKEN) return toast.error("Token tidak ditemukan");

      const url = `${BASE_API_URL}/user/updateStan`;

      const payload = {
        nama_stan: namaStan,
        nama_pemilik: namaPemilik,
        telepon,
      };

      const { data } = await put(url, payload, TOKEN);

      if (data?.status) {
        toast(data?.message, {
          hideProgressBar: false,
          containerId: "toastProfile",
          type: "success",
        });
        setEdit(false);
        storeCookie("nama_pemilik", namaPemilik);
        storeCookie("nama_stan", namaStan);
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
    <div className="bg-white rounded-xl border shadow p-6 space-y-6">
      <h2 className="text-lg font-semibold">Data Stan</h2>

      {/* Nama Stan */}
      <div>
        <label className="mb-1 block text-sm font-medium">Nama Stan</label>
        <input
          disabled={!edit}
          value={namaStan}
          onChange={(e) => setNamaStan(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary disabled:bg-gray-100"
        />
      </div>

      {/* Nama Pemilik */}
      <div>
        <label className="mb-1 block text-sm font-medium">Nama Pemilik</label>
        <input
          disabled={!edit}
          value={namaPemilik}
          onChange={(e) => setNamaPemilik(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary disabled:bg-gray-100"
        />
      </div>

      {/* Telepon */}
      <div>
        <label className="mb-1 block text-sm font-medium">Nomor Telepon</label>
        <input
          disabled={!edit}
          value={telepon}
          onChange={(e) => setTelepon(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary disabled:bg-gray-100"
        />
      </div>

      {/* Action */}
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

export default ProfileStanClient;
