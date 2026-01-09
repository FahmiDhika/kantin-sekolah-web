"use client";

import { FormEvent, useRef, useState } from "react";
import Modal from "@/components/modal";
import { IDiskon } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { put } from "@/lib/api-bridge";
import { getCookie } from "@/lib/client-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { CancelButton, SubmitButton } from "@/components/button";

interface Props {
  diskonData: IDiskon;
}

const formatDateInput = (date: string) =>
  new Date(date).toISOString().split("T")[0];

const UpdateDiskonModal = ({ diskonData }: Props) => {
  const [isShow, setIsShow] = useState(false);
  const [diskon, setDiskon] = useState<IDiskon>(diskonData);

  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const TOKEN = getCookie("token");
  if (!TOKEN) return null;

  const openModal = () => {
    setDiskon(diskonData);
    setIsShow(true);
  };

  const closeModal = () => {
    setIsShow(false);
    formRef.current?.reset();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const url = `${BASE_API_URL}/diskon/update/${diskonData.id}`;

      const payload = {
        nama_diskon: diskon.nama_diskon,
        persentase: diskon.persentase,
        tanggal_awal: diskon.tanggal_awal,
        tanggal_akhir: diskon.tanggal_akhir,
      };

      const { data } = await put(url, payload, TOKEN);

      if (data?.status) {
        setIsShow(false);
        toast(`Data diskon ${diskon.nama_diskon} berhasil di update.`, {
          hideProgressBar: false,
          containerId: "toastDiskon",
          type: "success",
        });
        closeModal();
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

  const isDisabled =
    !diskon.nama_diskon ||
    diskon.persentase <= 0 ||
    !diskon.tanggal_awal ||
    !diskon.tanggal_akhir;

  return (
    <>
      {/* Trigger Button */}
      <button onClick={openModal} className="text-blue-600 hover:text-blue-800">
        <Pencil size={18} />
      </button>

      {/* Modal */}
      <Modal open={isShow} onClose={closeModal} title="Update Diskon">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Diskon */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Nama Diskon <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              defaultValue={diskon.nama_diskon}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-orange-500"
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
                defaultValue={diskon.persentase}
                className="w-full rounded-lg border py-2 pl-3 pr-10 focus:ring-2 focus:ring-orange-500"
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
              defaultValue={formatDateInput(diskon.tanggal_awal)}
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
              defaultValue={formatDateInput(diskon.tanggal_akhir)}
              className="w-full rounded-lg border px-3 py-2"
              onChange={(e) =>
                setDiskon({ ...diskon, tanggal_akhir: e.target.value })
              }
            />
          </div>

          {/* Action */}
          <div className="mt-6 flex justify-between border-t pt-4">
            <CancelButton onClick={closeModal} type="button" />

            <SubmitButton
              type="submit"
              disabled={isDisabled}
              label="Update diskon"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UpdateDiskonModal;
