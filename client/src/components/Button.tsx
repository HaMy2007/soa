import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
};

const Button = ({ children, onClick, className }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`${className} inline-block text-2xl font-semibold rounded-[9px] border-none cursor-pointer transition-all duration-300 bg-orange-600 text-white hover:bg-orange-700`}
    >
      {children}
    </button>
  );
};

export default Button;
