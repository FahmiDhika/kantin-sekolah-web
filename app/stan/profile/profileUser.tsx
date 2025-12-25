"use client";

import { useState } from "react";
import { BASE_API_URL } from "@/global";
import { put } from "@/lib/api-bridge";
import { getCookie } from "@/lib/client-cookie";
import { toast } from "react-toastify";
import { IUpdateUser, IUserLogin } from "@/app/types";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  profile: IUserLogin;
}

export default function ProfileUserClient({ profile }: Props) {
  const [edit, setEdit] = useState(false);
  const [username, setUsername] = useState(profile.username);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      const TOKEN = getCookie("token");
      if (!TOKEN) return toast.error("Token tidak ditemukan");

      const url = `${BASE_API_URL}/user/update`;

      const payload: IUpdateUser = {
        username,
      };

      if (password.trim() !== "") {
        payload.password = password;
      }

      const { data } = await put(
        url,
        payload as unknown as Record<string, unknown>,
        TOKEN
      );

      if (data?.status) {
        toast(data?.message, {
          hideProgressBar: false,
          containerId: "toastProfile",
          type: "success",
        });
        setEdit(false);
        setPassword("");
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
      <h2 className="text-lg font-semibold">Informasi Akun</h2>

      {/* Username */}
      <div>
        <label className="mb-1 block text-sm font-medium">Username</label>
        <input
          disabled={!edit}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-primary disabled:bg-gray-100"
        />
      </div>

      {/* Password */}
      {edit && (
        <div>
          <label className="mb-1 block text-sm font-medium">
            Password Baru
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kosongkan jika tidak diubah"
              className="w-full rounded-lg border px-3 py-2 pr-10 focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      )}

      {/* Action */}
      <div className="flex justify-between border-t pt-4">
        {!edit ? (
          <button
            onClick={() => setEdit(true)}
            className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            Edit Akun
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                setEdit(false);
                setPassword("");
              }}
              className="rounded-lg border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
            >
              Simpan
            </button>
          </>
        )}
      </div>
    </div>
  );
}
