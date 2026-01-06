import SiswaTemplate from "@/components/siswa-template";
import { Metadata } from "next";
import buttonList from "../buttonList";

export const metadata: Metadata = {
  title: "Stan | Siswa",
  description: "Sistem kantin sekolah untuk pemesanan makanan minuman siswa",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiswaTemplate title="Stan" id="stan" buttonList={buttonList}>
      {children}
    </SiswaTemplate>
  );
}
