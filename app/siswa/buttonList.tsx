import { ReactNode } from "react";

// import icon
import { HiOutlineHome, HiOutlineUser,} from "react-icons/hi";
import { LuStore } from "react-icons/lu";
import { IoCartOutline } from "react-icons/io5";

interface IPropButton {
  id: string;
  path: string;
  label: string;
  icon: ReactNode;
}

const buttonList: IPropButton[] = [
  {
    id: `home`,
    path: `/siswa/home`,
    label: `Home`,
    icon: <HiOutlineHome />,
  },
  {
    id: `stan`,
    path: `/siswa/stan`,
    label: `Stan`,
    icon: <LuStore />,
  },
  {
    id: `cart`,
    path: `/siswa/cart`,
    label: `Keranjang`,
    icon: <IoCartOutline />,
  },
  {
    id: `profile`,
    path: `/siswa/profile`,
    label: `Profile`,
    icon: <HiOutlineUser />,
  },
];

export default buttonList;
