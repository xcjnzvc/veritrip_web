import Image from "next/image";

const bgStyles: Record<string, string> = {
  카카오: "bg-[#FEE500] text-[#3C1E1E]",
  네이버: "bg-[#03C75A] text-white",
  구글: "bg-white border border-[#ddd] text-gray-700",
  로그인: "bg-[#5E0E8C] text-white",
};

interface ButtonProps {
  text: string;
  color: string;
  route?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ text, color, route, onClick, disabled }: ButtonProps) {
  const selectedStyle = bgStyles[color] || "bg-gray-200 text-white";

  return (
    <div
      className={`${selectedStyle} relative flex w-full items-center justify-center rounded-lg px-4 py-3 shadow-sm transition-opacity hover:opacity-90 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
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
      <p className="text-[14px] font-semibold">
        {color === "로그인" ? text : `${text}로 계속하기`}
      </p>
    </div>
  );
}
