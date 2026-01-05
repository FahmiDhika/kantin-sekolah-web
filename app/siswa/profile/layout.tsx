import SiswaTemplate from "@/components/siswa-template";
import { Metadata } from "next";
import buttonList from "../buttonList";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Profile | Siswa",
  description: "Sistem kantin sekolah untuk pemesanan makanan minuman siswa",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiswaTemplate title="Profile" id="profile" buttonList={buttonList}>
      <ToastContainer containerId={`toastProfile`} />
      {children}
    </SiswaTemplate>
  );
}
