"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/public/Logo.svg";
import Cookies from "js-cookie";
import Button from "./button";
import { removeCookie } from "@/lib/client-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";

interface buttonType {
  id: string;
  icon: ReactNode;
  path: string;
  label: string;
}

interface stanProp {
  children: ReactNode;
  id: string;
  title: string;
  buttonList: buttonType[];
}

const Sidebar = ({ children, id, title, buttonList }: stanProp) => {
  const [isDropDown, setIsDropDown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [namaStan, setNamaStan] = useState("");
  const [namaPemilik, setNamaPemilik] = useState("");

  const router = useRouter();

  useEffect(() => {
    const nama_stan = Cookies.get("nama_stan");
    const nama_pemilik = Cookies.get("nama_pemilik");
    if (nama_stan) setNamaStan(nama_stan);
    if (nama_pemilik) setNamaPemilik(nama_pemilik);
  }, []);

  const toggleDropDown = () => setIsDropDown(!isDropDown);

  const handleLogout = () => {
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
      {/* Mobile Toggle */}
      <button
        className="lg:hidden absolute top-4 left-4 z-50 bg-white shadow p-2 rounded-md"
        onClick={() => setIsOpen(true)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static left-0 top-0 h-full w-64 p-6 flex flex-col justify-between bg-white shadow-xl z-40 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src={logo} alt="logo" width={130} height={130} />
          <h1 className="text-2xl font-bold mt-2">
            <span className="text-(--highlight)">Kantin</span> Sekolah
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-3 w-full">
          {buttonList.map((btn, index) => (
            <Button
              icon={btn.icon}
              path={btn.path}
              label={btn.label}
              active={btn.id === id}
              key={`keyMenu${index}`}
            />
          ))}
        </div>

        {/* Profile */}
        <div className="w-full relative">
          <div
            onClick={toggleDropDown}
            className="shadow-md flex px-4 py-3 rounded-xl justify-between items-center bg-white cursor-pointer"
          >
            <div className="flex gap-3 items-center">
              <FaRegUser size={24} />
              <div>
                <p className="text-md font-bold">{namaStan}</p>
                <p className="text-xs text-neutral-600">{namaPemilik}</p>
              </div>
            </div>
            <IoEllipsisVerticalSharp size={22} />
          </div>

          {/* Dropdown */}
          {isDropDown && (
            <div className="absolute bottom-16 left-0 w-full bg-white rounded-xl shadow-lg p-4 animate-fadeIn">
              <p className="font-bold text-md">{namaStan}</p>
              <p className="text-xs text-neutral-600 mb-2">{namaPemilik}</p>

              <hr className="my-2" />

              <Link
                href="/stan/profile"
                className="block w-full py-2 hover:text-neutral-500"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left py-2 hover:text-red-500 font-semibold"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-8 pt-20 md:pt-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        {children}
      </main>
    </section>
  );
};

export default Sidebar;
