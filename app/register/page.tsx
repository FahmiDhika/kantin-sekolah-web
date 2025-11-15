"use client";

import Image from "next/image";
import logo from "@/public/Logo.svg";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { BASE_API_URL } from "@/global";
import axios from "axios";
import Link from "next/link";

const RegisterPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("SISWA");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const url = `${BASE_API_URL}/user/register`;
      const payload = JSON.stringify({ username, password, role });

      const { data } = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast(data.message || "Registrasi berhasil!", {
        containerId: "toastRegister",
        type: "success",
        autoClose: 2000,
      });

      setTimeout(() => router.push("/login"), 2000);
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
      <ToastContainer containerId={"toastRegister"} />
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
            Daftar akun baru untuk melanjutkan.
          </p>
        </div>

        {/* FORM */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="relative">
            <label className="absolute -top-3 left-3 px-1 text-md bg-white text-(--shade-gelap)">
              Username
            </label>
            <input
              type="text"
              placeholder="Masukkan username…"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-(--highlight) outline-none w-full"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="absolute -top-3 left-3 px-1 text-md bg-white text-(--shade-gelap)">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password…"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 w-full rounded-lg border border-zinc-300 focus:ring-2 focus:ring-(--highlight) outline-none"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-(--highlight)"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block mb-2 font-medium text-(--shade-gelap)">
              Daftar sebagai
            </label>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="SISWA"
                  checked={role === "SISWA"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span>Siswa</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="ADMIN_STAN"
                  checked={role === "ADMIN_STAN"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span>Admin Stan</span>
              </label>
            </div>
          </div>

          {/* Tombol register */}
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
              "Register"
            )}
          </button>
        </form>

        {/* Back to login */}
        <p className="text-center mt-4 text-sm">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-blue-500 font-bold hover:underline"
          >
            Masuk sekarang
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
