"use client";

interface Props {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "reset" | "submit";
  label?: string;
}

export function SubmitButton({ onClick, disabled, type, label }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-6 py-2 font-semibold text-white ${
        disabled
          ? "cursor-not-allowed bg-gray-300"
          : "bg-orange-500 hover:bg-orange-600"
      }`}
    >
      {label}
    </button>
  );
}

export function CancelButton({ onClick, type }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="rounded-lg border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50"
    >
      Batal
    </button>
  );
}
