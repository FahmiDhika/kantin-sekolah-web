import { ReactNode } from "react";

// import icon
import { HiOutlineHome, HiOutlineUser, HiOutlineMenu } from "react-icons/hi";

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
    id: `menu`,
    path: `/siswa/menu`,
    label: `Menu`,
    icon: <HiOutlineMenu />,
  },
  {
    id: `profile`,
    path: `/siswa/profile`,
    label: `Profile`,
    icon: <HiOutlineUser />,
  },
];

export default buttonList;
