import StanTemplate from "@/components/stan-template";
import { Metadata } from "next";
import buttonList from "../buttonList";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Menu | Admin Stan",
  description:
    "Sistem kantin sekolah untuk pemesanan makanan minuman dari masing masing stan",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StanTemplate title="Menu" id="menu" buttonList={buttonList}>
      <ToastContainer containerId="toastMenu" />
      {children}
    </StanTemplate>
  );
}
