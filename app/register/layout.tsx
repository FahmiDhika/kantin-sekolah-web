import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kantin Sekolah | Register",
  description:
    "Sistem kantin sekolah untuk pemesanan makanan minuman dari masing masing stan",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
