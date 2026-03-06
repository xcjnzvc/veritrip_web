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
  route?: string; // 1. 이미지가 없을 수도 있으니 '?'를 붙여 선택 사항으로 만듭니다.
}

export default function Button({ text, color, route }: ButtonProps) {
  const selectedStyle = bgStyles[color] || "bg-gray-200 text-white";

  return (
    <div
      className={`${selectedStyle} relative flex items-center justify-center px-4 py-3 rounded-lg cursor-pointer transition-opacity hover:opacity-90 w-full shadow-sm`}
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

      <p className="font-semibold text-[14px]">
        {color === "로그인" ? text : `${text}로 계속하기`}
      </p>
    </div>
  );
}
