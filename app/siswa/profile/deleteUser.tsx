"use client";

import { IDeleteUser } from "@/app/types";
import Modal from "@/components/modal";
import { BASE_API_URL } from "@/global";
import { drop } from "@/lib/api-bridge";
import { getCookie, removeCookie } from "@/lib/client-cookie";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

const DeleteUser = ({ selectedUser }: { selectedUser: IDeleteUser }) => {
  const [isShow, setIsShow] = useState(false);

  const router = useRouter();

  const openModal = () => {
    setIsShow(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const TOKEN = await getCookie("token");
      if (!TOKEN) return null;

      const url = `${BASE_API_URL}/user/delete`;

      const { data } = await drop(url, TOKEN);

      if (data?.status) {
        setIsShow(false);
        toast(data?.message, {
          hideProgressBar: false,
          containerId: `toastProfile`,
          type: `success`,
        });
        removeCookie("token");
        removeCookie("foto");
        removeCookie("nama");
        removeCookie("role");
        removeCookie("id");
        removeCookie("username");
        router.replace("/login");
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
    <>
      <button
        onClick={openModal}
        className="w-full bg-red-300 rounded-xl py-4 text-md shadow hover:bg-red-400 ease-in-out duration-300 font-medium text-red-600 hover:text-red-800"
      >
        Hapus Akun
      </button>

      <Modal open={isShow} onClose={() => setIsShow(false)} title="Hapus Akun">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <span className="text-2xl text-red-600">⚠️</span>
            </div>
          </div>

          {/* Warning Text */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Apakah kamu yakin?
            </h3>
            <p className="text-sm text-gray-500">
              Akun <b>{selectedUser.username}</b> akan dihapus secara permanen.
              <br />
              Tindakan ini{" "}
              <span className="font-semibold text-red-600">
                tidak bisa dibatalkan
              </span>
              .
            </p>
          </div>

          {/* Action */}
          <div className="mt-6 flex justify-between border-t pt-4">
            {/* Batal */}
            <button
              type="button"
              onClick={() => setIsShow(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Batal
            </button>

            {/* Hapus */}
            <button
              type="submit"
              className="rounded-lg bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700"
            >
              Ya, Hapus Akun
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default DeleteUser;
