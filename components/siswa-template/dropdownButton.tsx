"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BASE_SUPABASE_URL } from "@/global";
import avatarDefault from "@/public/avatar-default.svg";
import { removeCookie } from "@/lib/client-cookie";
import { useRouter } from "next/navigation";

interface Props {
  nama: string;
  foto?: string | null;
}

export default function UserDropdown({ nama, foto }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 👉 Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    removeCookie("token");
    removeCookie("foto");
    removeCookie("nama");
    removeCookie("role");
    removeCookie("id");
    removeCookie("username");

    router.replace("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* TRIGGER */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 lg:gap-3 focus:outline-none"
      >
        <h1 className="text-sm lg:text-lg font-bold border-b border-orange-300 px-1 lg:px-2 truncate max-w-[120px] lg:max-w-none">
          {nama}
        </h1>

        {mounted && (
          <Image
            src={
              foto
                ? `${BASE_SUPABASE_URL}/storage/v1/object/public/siswa/${foto}`
                : avatarDefault
            }
            alt="Avatar"
            width={32}
            height={32}
            className="object-cover aspect-square rounded-full border lg:w-10 lg:h-10"
          />
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow-lg overflow-hidden z-50 text-red-600 hover:bg-red-50">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
