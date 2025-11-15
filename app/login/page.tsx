"use client";

import Image from "next/image";
import logo from "@/public/Logo.svg";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { BASE_API_URL } from "@/global";
import axios from "axios";
import { storeCookie } from "@/lib/client-cookie";
import Link from "next/link";

const LoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true); // ★ ACTIVE LOADING

      const url = `${BASE_API_URL}/user/login`;
      const payload = JSON.stringify({ username, password });

      const { data } = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (data.logged === true) {
        toast(data.message, {
          hideProgressBar: false,
          containerId: `toastLogin`,
          type: "success",
          autoClose: 2000,
        });

        storeCookie("token", data.token);
        storeCookie("id", data.data.id);
        storeCookie("username", data.data.username);
        storeCookie("role", data.data.role);

        const role = data.data.role;

        if (role === `ADMIN_STAN`) {
          setTimeout(() => router.replace(`/stan/dashboard`), 2000);
        } else if (role === `SISWA`) {
          setTimeout(() => router.replace(`/siswa/dashboard`), 2000);
        }
      } else {
        toast(data.message, {
          hideProgressBar: false,
          containerId: `toastLogin`,
          type: "warning",
          autoClose: 2000,
        });
      }
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
      <ToastContainer containerId={"toastLogin"} />
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
            Silakan masuk untuk melanjutkan.
          </p>
        </div>

        {/* FORM */}
        <form className="flex flex-col gap-6 mb-12" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="relative">
            <label className="absolute -top-3 left-3 px-1 text-md bg-white text-(--shade-gelap)">
              Username
            </label>
            <input
              type="text"
              placeholder="Masukkan username akun…"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-(--highlight) outline-none w-full"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="absolute -top-3 left-3 px-1 text-md bg-white text-(--shade-gelap)">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password akun…"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 w-full rounded-lg border border-zinc-300 focus:ring-2 focus:ring-(--highlight) outline-none"
            />

            {/* Show / Hide */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-(--highlight)"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end -mt-3">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Lupa Password?
            </Link>
          </div>

          {/* Tombol login */}
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
              "Login"
            )}
          </button>
        </form>

        <div className="flex justify-start -mt-3 gap-1">
          <p>Belum punya akun?</p>
          <Link
            href="/register"
            className="text-blue-500 font-bold hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
