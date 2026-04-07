import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const isFloating = isFocused || value.length > 0;

  // ✅ 추가: border 색과 동일한 아이콘 색 계산
  const borderColor = isLoginMode
    ? isFloating
      ? "#5E0E8C"
      : "#ddd"
    : isFloating
      ? "#ffffff"
      : "#828282";

  return (
    <div
      className={`relative w-full rounded-[10px] border transition-all duration-200 ${
        isLoginMode
          ? `bg-white ${isFloating ? "border-[#5E0E8C]" : "border-[#ddd]"}`
          : `bg-[#171717] ${isFloating ? "border-white" : "border-[#828282]"}`
      } ${className} `}
    >
      <label
        className={`pointer-events-none absolute left-[12px] px-[4px] transition-all duration-200 ease-in-out ${
          isLoginMode ? "bg-white" : "bg-[#171717]"
        } ${
          isFloating
            ? `top-[-10px] text-[12px] ${isLoginMode ? "text-[#5E0E8C]" : "text-white"}`
            : "top-[50%] -translate-y-1/2 text-[14px]"
        } ${!isFloating ? (isLoginMode ? "text-[#999]" : "text-[#828282]") : ""} `}
      >
        {placeholder}
      </label>

      <input
        type={isPassword && showPassword ? "text" : type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-transparent px-[16px] py-[14px] text-[14px] focus:outline-none ${
          isLoginMode ? "text-black" : "text-white"
        } ${isPassword ? "pr-[44px]" : ""} `}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-[50%] right-[12px] -translate-y-1/2"
        >
          {showPassword ? (
            <EyeOff size={20} color={borderColor} />
          ) : (
            <Eye size={20} color={borderColor} />
          )}
        </button>
      )}
    </div>
  );
}
