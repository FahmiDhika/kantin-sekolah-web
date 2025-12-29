import Link from "next/link";
import React from "react";
import clsx from "clsx";

interface ButtonProps {
  icon: React.ReactNode;
  label?: string;
  path: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const MenuButton = ({
  icon,
  label,
  path,
  active = false,
  collapsed = false,
  onClick,
}: ButtonProps) => {
  return (
    <Link
      href={path}
      onClick={onClick}
      className={clsx(
        "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all",
        active
          ? "text-blue-600 bg-yellow-400"
          : "text-gray-500 hover:text-blue-500"
      )}
    >
      <div
        className={`relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
          active
            ? "bg-yellow-400 text-yellow-900 shadow-md"
            : "text-neutral-500 hover:bg-yellow-100 hover:text-yellow-700"
        }`}
      >
        {/* ACTIVE INDICATOR */}
        {active && (
          <span className="absolute -top-1 w-8 h-1 bg-yellow-700 rounded-full" />
        )}

        {/* ICON */}
        <div className="text-xl">{icon}</div>

        {/* LABEL */}
        {!collapsed && (
          <span className="text-[11px] font-semibold leading-none">
            {label}
          </span>
        )}
      </div>
    </Link>
  );
};

export default MenuButton;
