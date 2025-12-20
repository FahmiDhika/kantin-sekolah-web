"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { removeCookie } from "@/lib/client-cookie";
import { useRouter } from "next/navigation";
import MenuButton from "./button";
import logo from "@/public/Logo.svg";
import { FiLogOut, FiMenu } from "react-icons/fi";

interface ButtonType {
  id: string;
  icon: ReactNode;
  path: string;
  label: string;
}

interface SidebarProps {
  children: ReactNode;
  title: string;
  id: string;
  buttonList: ButtonType[];
}

const Sidebar = ({ children, title, id, buttonList }: SidebarProps) => {
  const router = useRouter();
  const [namaStan, setNamaStan] = useState("");
  const [namaPemilik, setNamaPemilik] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setNamaStan(Cookies.get("nama_stan") || "");
    setNamaPemilik(Cookies.get("nama_pemilik") || "");
  }, []);

  const logout = () => {
    removeCookie("token");
    removeCookie("id");
    removeCookie("username");
    removeCookie("role");
    removeCookie("nama_stan");
    removeCookie("nama_pemilik");
    router.replace("/login");
  };

  return (
    <section className="w-full h-dvh flex bg-neutral-100 overflow-hidden">
      {/* HAMBURGER (MOBILE) */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow rounded-lg"
      >
        <FiMenu size={20} />
      </button>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 left-0 z-40
        w-72 h-dvh bg-white flex flex-col justify-between border-r
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* TOP */}
        <div className="p-6">
          {/* HEADER */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center">
              <Image src={logo} alt="logo" width={28} height={28} />
            </div>
            <div>
              <p className="font-bold text-lg">Kantin Admin</p>
              <p className="text-sm text-neutral-500 truncate">{namaStan}</p>
            </div>
          </div>

          {/* INFO */}
          <div className="bg-yellow-50 text-yellow-700 rounded-xl p-4 text-sm mb-6">
            <p className="font-semibold">Admin Stan</p>
            <p>{namaPemilik}</p>
          </div>

          {/* MENU */}
          <nav className="flex flex-col gap-4">
            {buttonList.map((item) => (
              <MenuButton
                key={item.id}
                {...item}
                active={item.id === id}
                onClick={() => setIsOpen(false)} // auto close mobile
              />
            ))}
          </nav>
        </div>

        {/* LOGOUT */}
        <div className="border-t mx-4 mb-6 pt-4">
          <button
            onClick={logout}
            className="w-full rounded-xl px-4 py-3 flex items-center gap-3
            text-red-500 hover:bg-red-50 transition"
          >
            <FiLogOut className="text-lg" />
            Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 pt-20 lg:pt-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        {children}
      </main>
    </section>
  );
};

export default Sidebar;
