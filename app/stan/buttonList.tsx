import { ReactNode } from "react";

// import logo
import { RxDashboard } from "react-icons/rx";
import { MdRestaurantMenu } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { FaHistory } from "react-icons/fa";

interface IPropButton {
  id: string;
  path: string;
  label: string;
  icon: ReactNode;
}

const buttonList: IPropButton[] = [
  {
    id: `dashboard`,
    path: `/stan/dashboard`,
    label: `Dashboard`,
    icon: <RxDashboard size={24} />,
  },
  {
    id: `menu`,
    path: `/stan/menu`,
    label: `Menu`,
    icon: <MdRestaurantMenu size={24} />,
  },
  {
    id: `transaksi`,
    path: `/stan/transaksi`,
    label: `Transaksi`,
    icon: <GrTransaction size={24} />,
  },
  {
    id: `riwayat`,
    path: `/stan/riwayat`,
    label: `Riwayat`,
    icon: <FaHistory size={24} />,
  },
];

export default buttonList;
