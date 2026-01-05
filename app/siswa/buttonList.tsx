import { ReactNode } from "react";

// import icon
import { HiOutlineHome, HiOutlineUser } from "react-icons/hi";

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
    id: `profile`,
    path: `/siswa/profile`,
    label: `Profile`,
    icon: <HiOutlineUser />,
  },
];

export default buttonList;
