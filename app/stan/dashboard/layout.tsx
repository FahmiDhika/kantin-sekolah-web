import StanTemplate from "@/components/stan-template";
import { Metadata } from "next";
import buttonList from "../buttonList";

export const metadata: Metadata = {
  title: "Dashboard | Admin Stan",
  description:
    "Sistem kantin sekolah untuk pemesanan makanan minuman dari masing masing stan",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StanTemplate title="Dashboard" id="dashboard" buttonList={buttonList}>
      {children}
    </StanTemplate>
  );
}
