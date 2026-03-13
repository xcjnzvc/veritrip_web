import { useState } from "react";

interface InputProps {
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  isLoginMode?: boolean;
}

export default function LoginInput({
  placeholder,
  type = "text",
  value = "",
  onChange,
  className = "",
  isLoginMode = true,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || value.length > 0;

  return (
    <div
      className={`
        relative w-full rounded-[10px] border transition-all duration-200
        ${
          isLoginMode
            ? `bg-white ${isFloating ? "border-[#5E0E8C]" : "border-[#ddd]"}`
            : `bg-[#171717] ${isFloating ? "border-white" : "border-[#828282]"}`
        }
        ${className}
      `}
    >
      <label
        className={`
          absolute left-[12px] px-[4px] pointer-events-none transition-all duration-200 ease-in-out
          ${isLoginMode ? "bg-white" : "bg-[#171717]"}
          ${
            isFloating
              ? `top-[-10px] text-[12px] ${isLoginMode ? "text-[#5E0E8C]" : "text-white"}`
              : "top-[50%] -translate-y-1/2 text-[14px]"
          }
          ${!isFloating ? (isLoginMode ? "text-[#999]" : "text-[#828282]") : ""}
        `}
      >
        {placeholder}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full py-[14px] px-[16px] text-[14px] focus:outline-none bg-transparent
          ${isLoginMode ? "text-black" : "text-white"}
        `}
      />
    </div>
  );
}
