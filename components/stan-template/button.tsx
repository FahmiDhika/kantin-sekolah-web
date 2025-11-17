import React from "react";
import Link from "next/link";

interface buttonProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
}

const button = ({ icon, label, path, active }: buttonProps) => {
  return (
    <Link href={path}>
      <div
        className={`shadow-md flex gap-3 px-4 py-4 rounded-xl items-center bg-(--highlight) ${
          active ? "bg-(--highlight)" : "bg-white"
        }`}
      >
        {icon}
        <p className="text-md font-bold">{label}</p>
      </div>
    </Link>
  );
};

export default button;
