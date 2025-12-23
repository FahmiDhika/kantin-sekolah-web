"use client";

import { FormEvent, useRef, useState } from "react";
import Modal from "@/components/modal";
import { IDiskon } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { post } from "@/lib/api-bridge";
import { getCookie } from "@/lib/client-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

const AddDiskonModal = () => {
  const [isShow, setIsShow] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const [diskon, setDiskon] = useState<IDiskon>({
    id: 0,
    id_stan: 0,
    nama_diskon: "",
    persentase: 0,
    tanggal_akhir: "",
    tanggal_awal: "",
  });

  const TOKEN = getCookie("token");

  if (!TOKEN) {
    toast.error("Token tidak ditemukan, silakan login ulang", {
      hideProgressBar: false,
      containerId: "toastDiskon",
      type: "warning",
    });
    return;
  }

  const openModal = () => {
    setDiskon({
      id: 0,
      id_stan: 0,
      nama_diskon: "",
      persentase: 0,
      tanggal_akhir: "",
      tanggal_awal: "",
    });
    setIsShow(true);
    formRef.current?.reset();
  };

  const closeModal = () => {
    setIsShow(false);
    formRef.current?.reset();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const url = `${BASE_API_URL}/diskon/create`;

      const payload = {
        nama_diskon: diskon.nama_diskon,
        persentase: diskon.persentase,
        tanggal_awal: diskon.tanggal_awal,
        tanggal_akhir: diskon.tanggal_akhir,
      };

      const { data } = await post(url, payload, TOKEN);

      if (data?.status) {
        setIsShow(false);
        toast(data?.message, {
          hideProgressBar: false,
          containerId: `toastDiskon`,
          type: "success",
        });
        setTimeout(() => router.refresh(), 1000);
      } else {
        toast(data?.message, {
          hideProgressBar: false,
          containerId: `toastDiskon`,
          type: `warning`,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan", {
        hideProgressBar: false,
        containerId: "toastDiskon",
        type: "error",
      });
    }
  };

  const isDisabled =
    !diskon.nama_diskon ||
    diskon.persentase <= 0 ||
    !diskon.tanggal_awal ||
    !diskon.tanggal_akhir;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-medium text-white shadow hover:bg-orange-600"
      >
        <Plus size={18} />
        Tambah Diskon
      </button>

      {/* Modal */}
      <Modal open={isShow} onClose={closeModal} title="Tambah Diskon">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Diskon */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Nama Diskon <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary"
              onChange={(e) =>
                setDiskon({ ...diskon, nama_diskon: e.target.value })
              }
            />
          </div>

          {/* Persentase */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Persentase <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={100}
                required
                className="w-full rounded-lg border py-2 pl-3 pr-10 focus:ring-2 focus:ring-primary"
                onChange={(e) =>
                  setDiskon({
                    ...diskon,
                    persentase: Number(e.target.value),
                  })
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                %
              </span>
            </div>
          </div>

          {/* Tanggal Awal */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Tanggal Mulai <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              className="w-full rounded-lg border px-3 py-2"
              onChange={(e) =>
                setDiskon({ ...diskon, tanggal_awal: e.target.value })
              }
            />
          </div>

          {/* Tanggal Akhir */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Tanggal Berakhir <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              className="w-full rounded-lg border px-3 py-2"
              onChange={(e) =>
                setDiskon({ ...diskon, tanggal_akhir: e.target.value })
              }
            />
          </div>

          {/* Action */}
          <div className="mt-6 flex justify-between border-t pt-4">
            {/* Batal */}
            <button
              type="button"
              onClick={closeModal}
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
              Simpan Diskon
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddDiskonModal;
