import { ReactNode } from "react";

// import logo
import {
  HiOutlineViewGrid,
  HiOutlineClipboardList,
  HiOutlineShoppingBag,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineTag
} from "react-icons/hi";

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
    icon: <HiOutlineViewGrid />,
  },
  {
    id: `menu`,
    path: `/stan/menu`,
    label: `Menu`,
    icon: <HiOutlineClipboardList />,
  },
  {
    id: `diskon`,
    path: `/stan/diskon`,
    label: `Diskon`,
    icon: <HiOutlineTag />,
  },
  {
    id: `transaksi`,
    path: `/stan/transaksi`,
    label: `Transaksi`,
    icon: <HiOutlineShoppingBag />,
  },
  {
    id: `riwayat`,
    path: `/stan/riwayat`,
    label: `Riwayat`,
    icon: <HiOutlineChartBar />,
  },
  {
    id: `profile`,
    path: `/stan/profile`,
    label: `Profile`,
    icon: <HiOutlineUser />,
  },
];

export default buttonList;
