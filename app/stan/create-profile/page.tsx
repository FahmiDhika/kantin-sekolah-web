"use client";

import Image from "next/image";
import logo from "@/public/Logo.svg";
import { useState, FormEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/global";
import { getCookie, storeCookie } from "@/lib/client-cookie";
import { post } from "@/lib/api-bridge";

const FormStanPage = () => {
  const [namaPemilik, setNamaPemilik] = useState<string>("");
  const [namaStan, setNamaStan] = useState<string>("");
  const [telepon, setTelepon] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = getCookie("token");

    if (!token) {
      toast("Token tidak ditemukan, silakan login ulang!", {
        hideProgressBar: false,
        containerId: `toastStan`,
        type: "warning",
        autoClose: 2000,
      });
      return;
    }

    let userId: string | null = null;
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        userId = decoded.id;
      } catch {}
    }

    const url = `${BASE_API_URL}/user/dataStan/${userId}`;

    if (!namaPemilik || !namaStan || !telepon) {
      toast("Semua field wajib diisi!", { type: "warning" });
      return;
    }

    try {
      setLoading(true);

      const body = {
        nama_pemilik: namaPemilik,
        nama_stan: namaStan,
        telepon: telepon,
      };

      storeCookie("nama_stan", namaStan);
      storeCookie("nama_pemilik", namaPemilik);

      const { data } = await post(url, body, token);

      toast(data.message, {
        hideProgressBar: false,
        containerId: `toastStan`,
        type: "success",
        autoClose: 2000,
      });

      setTimeout(() => router.replace("/stan/dashboard"), 2000);
    } catch (error) {
      console.log(error);
      toast(`Terjadi sesuatu kesalahan`, {
        hideProgressBar: false,
        containerId: `toastStan`,
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
      <ToastContainer containerId={"toastStan"} autoClose={2000} />
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
            Lengkapi data stan Anda.
          </p>
        </div>

        {/* FORM */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* NAMA PEMILIK */}
          <div className="relative">
            <label className="absolute -top-3 left-3 px-1 text-md bg-white text-(--shade-gelap)">
              Nama Pemilik
            </label>
            <input
              type="text"
              placeholder="Masukkan nama pemilik…"
              value={namaPemilik}
              onChange={(e) => setNamaPemilik(e.target.value)}
              className="px-4 py-3 w-full rounded-lg border border-zinc-300 focus:ring-2 focus:ring-(--highlight) outline-none"
              required
            />
          </div>

          {/* NAMA STAN */}
          <div className="relative">
            <label className="absolute -top-3 left-3 px-1 text-md bg-white text-(--shade-gelap)">
              Nama Stan
            </label>
            <input
              type="text"
              placeholder="Masukkan nama stan…"
              value={namaStan}
              onChange={(e) => setNamaStan(e.target.value)}
              className="px-4 py-3 w-full rounded-lg border border-zinc-300 focus:ring-2 focus:ring-(--highlight) outline-none"
              required
            />
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

export default FormStanPage;
