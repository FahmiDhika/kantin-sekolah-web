import { ReactNode } from "react";
import NavBar from "./navBar";

type ButtonType = {
  id: string;
  path: string;
  label: string;
  icon: ReactNode;
};

type SiswaProp = {
  children: ReactNode;
  id: string;
  title: string;
  buttonList: ButtonType[];
};

const SiswaTemplate = ({ children, id, title, buttonList }: SiswaProp) => {
  return (
    <div className="w-full min-h-dvh">
      <NavBar buttonList={buttonList} id={id} title={title}>
        {children}
      </NavBar>
    </div>
  );
};

export default SiswaTemplate;
