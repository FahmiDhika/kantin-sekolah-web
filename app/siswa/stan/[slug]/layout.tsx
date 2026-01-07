import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stan | Siswa",
  description: "Sistem kantin sekolah untuk pemesanan makanan minuman siswa",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
