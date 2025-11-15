"use client";

import Image from "next/image";
import logo from "@/public/Logo.svg";
import { useState, FormEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/global";
import { getCookie } from "@/lib/client-cookie";
import { post } from "@/lib/api-bridge";

const FormSiswaPage = () => {
  const [nama, setNama] = useState<string>("");
  const [alamat, setAlamat] = useState<string>("");
  const [telepon, setTelepon] = useState<string>("");
  const [fotoProfil, setFotoProfil] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoProfil(file);
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = getCookie("token");

    if (!token) {
      toast("Token tidak ditemukan, silakan login ulang!", { type: "error" });
      return;
    }

    let userId: string | null = null;
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        userId = decoded.id;
      } catch {}
    }

    const url = `${BASE_API_URL}/user/dataSiswa/${userId}`;
    if (!nama || !alamat || !telepon) {
      toast("Semua field wajib diisi!", { type: "warning" });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("alamat", alamat);
      formData.append("telepon", telepon);
      if (fotoProfil) {
        formData.append("foto", fotoProfil);
      }

      const { data } = await post(url, formData, token);

      toast(data.message, {
        hideProgressBar: false,
        containerId: `toastLogin`,
        type: "error",
        autoClose: 2000,
      });

      setTimeout(() => router.replace("/siswa/dashboard"), 2000);
    } catch (error) {
      console.log(error);
      toast(`Terjadi sesuatu kesalahan`, {
        hideProgressBar: false,
        containerId: `toastLogin`,
        type: "error",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="min-w-screen min-h-dvh flex justify-center items-center px-4 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/foto kantin.svg')" }}
    >
      <ToastContainer containerId={"toastLogin"} autoClose={2000} />
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 w-full max-w-md bg-white shadow-lg border border-zinc-200 rounded-2xl p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image src={logo} alt="logo" width={150} height={150} />

          <h1 className="text-3xl font-bold mt-3">
            <span className="text-(--highlight)">Kantin</span>{" "}
            <span className="text-(--shade-gelap)">Sekolah</span>
          </h1>

          <p className="text-sm text-(--shade-gelap) opacity-80">
            Lengkapi data pribadi siswa Anda.
          </p>
        </div>

        {/* FORM */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* NAMA */}
          <div className="relative">
            <label className="absolute -top-3 left-3 px-1 text-md bg-white text-(--shade-gelap)">
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap…"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="px-4 py-3 w-full rounded-lg border border-zinc-300 focus:ring-2 focus:ring-(--highlight) outline-none"
              required
            />
          </div>

          {/* ALAMAT */}
          <div className="relative">
            <label className="absolute -top-3 left-3 px-1 text-md bg-white text-(--shade-gelap)">
              Alamat
            </label>
            <textarea
              placeholder="Masukkan alamat lengkap…"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="px-4 py-3 w-full rounded-lg border border-zinc-300 focus:ring-2 focus:ring-(--highlight) outline-none resize-none"
              rows={3}
              required
            ></textarea>
          </div>

          {/* TELEPON */}
          <div className="relative">
            <label className="absolute -top-3 left-3 px-1 text-md bg-white text-(--shade-gelap)">
              Telepon
            </label>
            <input
              type="text"
              placeholder="Contoh: 081234567890"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              className="px-4 py-3 w-full rounded-lg border border-zinc-300 focus:ring-2 focus:ring-(--highlight) outline-none"
              required
            />
          </div>

          {/* FOTO PROFIL (DESAIN TETAP) */}
          <div className="flex flex-col items-center gap-3 mt-2">
            <label className="font-medium text-(--shade-gelap)">
              Foto Profil
            </label>

            {previewFoto ? (
              <Image
                src={previewFoto}
                alt="Preview Foto"
                width={120}
                height={120}
                className="rounded-full object-cover border"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-200 flex justify-center items-center text-sm text-gray-600">
                No Image
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="text-sm mt-1"
            />
          </div>

          {/* TOMBOL SIMPAN */}
          <button
            type="submit"
            disabled={loading}
            className={`py-2.5 rounded-lg text-white font-semibold transition flex justify-center items-center ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            style={{ backgroundColor: "var(--highlight)" }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Simpan Data"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default FormSiswaPage;
