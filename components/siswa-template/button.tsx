import Link from "next/link";
import React from "react";
import clsx from "clsx";

interface ButtonProps {
  icon: React.ReactNode;
  label?: string;
  path: string;
  active?: boolean;
  onClick?: () => void;
}

const MenuButton = ({
  icon,
  label,
  path,
  active = false,
  onClick,
}: ButtonProps) => {
  return (
    <Link
      href={path}
      onClick={onClick}
      className="flex items-center justify-center w-full h-full"
    >
      <div
        className={clsx(
          "relative flex flex-col items-center justify-center overflow-hidden",
          "px-4 py-3 rounded-2xl transition-all duration-200",
          active
            ? "bg-yellow-400 text-yellow-900 shadow-md"
            : "text-gray-500 hover:bg-yellow-100 hover:text-yellow-700"
        )}
      >
        {active && (
          <span className="absolute top-0 w-8 h-1 bg-yellow-700 rounded-b-full" />
        )}

        <div className="text-2xl">{icon}</div>

        <span className="hidden sm:block text-[11px] font-semibold mt-0.5">
          {label}
        </span>
      </div>
    </Link>
  );
};

export default MenuButton;
