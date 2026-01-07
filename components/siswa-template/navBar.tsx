"use client";

import { ReactNode, useEffect, useState } from "react";
import { getCookie } from "@/lib/client-cookie";
import Cookies from "js-cookie";
import Image from "next/image";
import MenuButton from "./button";
import logo from "@/public/Logo.svg";
import UserDropdown from "./dropdownButton";

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

const NavBar = ({ children, title, id, buttonList }: SidebarProps) => {
  const [nama, setNama] = useState("");
  const foto = getCookie("foto");

  useEffect(() => {
    setNama(Cookies.get("nama") || "");
  }, []);

  return (
    <section className="w-full h-dvh flex flex-col items-center bg-neutral-100 px-4 lg:px-32 background">
      <header className="w-full sticky top-0 z-10 px-4 py-3 lg:px-16 lg:py-4 shadow bg-white rounded-b-2xl lg:rounded-b-3xl flex items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-5">
          <Image
            src={logo}
            alt="logo"
            width={40}
            height={40}
            className="lg:w-12 lg:h-12"
          />

          <div className="leading-tight">
            <h1 className="text-base lg:text-xl font-bold">Kantin Sekolah</h1>
            <p className="text-xs lg:text-sm text-neutral-500">{title}</p>
          </div>
        </div>

        <UserDropdown nama={nama} foto={foto} />
      </header>

      <main className="w-full flex-1 overflow-auto px-2 py-4 lg:px-16 pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 px-4 lg:px-32">
        <div className="flex justify-around items-center bg-white py-2 rounded-t-2xl shadow">
          {buttonList.map((item) => (
            <MenuButton key={item.id} {...item} active={item.id === id} />
          ))}
        </div>
      </nav>
    </section>
  );
};

export default NavBar;
