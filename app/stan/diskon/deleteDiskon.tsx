"use client";

import { IDiskon } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { drop } from "@/lib/api-bridge";
import { getCookie } from "@/lib/client-cookie";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import Modal from "@/components/modal";

interface Props {
  selectedDiskon: IDiskon;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const DeleteDiskonModal = ({ selectedDiskon }: Props) => {
  const [isShow, setIsShow] = useState<boolean>(false);

  const router = useRouter();
  const TOKEN = getCookie("token");
  if (!TOKEN) return null;

  const openModal = () => {
    setIsShow(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const url = `${BASE_API_URL}/diskon/delete/${selectedDiskon.id}`;
      const { data } = await drop(url, TOKEN);

      if (data?.status) {
        setIsShow(false);
        toast(`Diskon ${selectedDiskon.menu_diskon} berhasil dihapus.`, {
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
      <button onClick={openModal} className="text-red-600 hover:text-red-800">
        <Trash2 size={18} />
      </button>

      {/* Modal */}
      <Modal
        open={isShow}
        onClose={() => setIsShow(false)}
        title="Hapus Diskon"
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">
            Apakah kamu yakin ingin menghapus diskon berikut?
          </p>

          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 space-y-1">
            <p className="font-semibold text-base">
              {selectedDiskon.nama_diskon}
            </p>

            <p>
              Diskon: <strong>{selectedDiskon.persentase}%</strong>
            </p>

            <p className="text-xs text-red-600">
              Berlaku: {formatDate(selectedDiskon.tanggal_awal)} –{" "}
              {formatDate(selectedDiskon.tanggal_akhir)}
            </p>
          </div>

          <p className="text-xs text-gray-500">
            Diskon yang dihapus tidak dapat dikembalikan.
          </p>

          <div className="mt-6 flex justify-between border-t pt-4">
            <button
              type="button"
              onClick={() => setIsShow(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
            >
              Batal
            </button>

            <button
              type="submit"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default DeleteDiskonModal;
