import { ReactNode } from "react";
import Sidebar from "./sidebar";

type ButtonType = {
  id: string;
  path: string;
  label: string;
  icon: ReactNode;
};

type StanProp = {
  children: ReactNode;
  id: string;
  title: string;
  buttonList: ButtonType[];
};

const StanTemplate = ({ children, id, title, buttonList }: StanProp) => {
  return (
    <div className="w-full min-h-dvh">
      <Sidebar buttonList={buttonList} id={id} title={title}>
        {children}
      </Sidebar>
    </div>
  );
};

export default StanTemplate;
