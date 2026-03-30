import Image from "next/image";

const bgStyles: Record<string, string> = {
  카카오: "bg-[#FEE500] text-[#3C1E1E]",
  네이버: "bg-[#03C75A] text-white",
  구글: "bg-white border border-[#ddd] text-gray-700",
  메인: "bg-[#5E0E8C] text-white",
  회색: "bg-[#ddd] text-[#666]",
};

interface ButtonProps {
  text: string;
  color: string;
  route?: string;
  onClick?: () => void;
  disabled?: boolean;
  textSize?: string;
  textWeight?: string;
  textColor?: string;
}

export default function Button({
  text,
  color,
  route,
  onClick,
  disabled,
  textSize = "text-[14px]",
  textWeight = "font-semibold",
  textColor,
}: ButtonProps) {
  const selectedStyle = bgStyles[color] || "bg-gray-200 text-white";

  return (
    <div
      className={`
        ${selectedStyle}
        relative w-full flex items-center justify-center px-4 py-4 rounded-xl 
        transition-opacity hover:opacity-90 shadow-sm
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      onClick={disabled ? undefined : onClick}
    >
      {route && (
        <Image
          src={route}
          alt={`${text} 아이콘`}
          width={20}
          height={20}
          className="absolute left-4"
        />
      )}
      <p className={`${textWeight} ${textSize} ${textColor ?? ""}`}>{text}</p>
    </div>
  );
}
