import SiswaTemplate from "@/components/siswa-template";
import { Metadata } from "next";
import buttonList from "../buttonList";

export const metadata: Metadata = {
  title: "Home | Siswa",
  description: "Sistem kantin sekolah untuk pemesanan makanan minuman siswa",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiswaTemplate title="Home" id="home" buttonList={buttonList}>
      {children}
    </SiswaTemplate>
  );
}
