import Link from "next/link";
import React from "react";

interface ButtonProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const MenuButton = ({
  icon,
  label,
  path,
  active,
  collapsed,
  onClick,
}: ButtonProps) => {
  return (
    <Link href={path} onClick={onClick}>
      <div
        className={`
          relative flex items-center gap-3 px-3 py-3 rounded-xl transition shadow
          ${active ? "bg-yellow-400" : "hover:bg-neutral-100"}
        `}
      >
        {/* ACTIVE INDICATOR */}
        {active && (
          <span className="absolute left-0 top-2 bottom-2 w-1 bg-yellow-700 rounded-r" />
        )}

        <div className="text-lg">{icon}</div>
        {!collapsed && <span className="font-medium">{label}</span>}
      </div>
    </Link>
  );
};

export default MenuButton;
