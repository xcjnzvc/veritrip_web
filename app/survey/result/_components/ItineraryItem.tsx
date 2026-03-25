// "use client";
// import Image from "next/image";

// interface ItineraryItemProps{
//     imageUrl:string;
//     iconUrl: string;
//     title: string;
//     description:string;
// }

// export default function ItineraryItem({imageUrl, iconUrl, title, description}:ItineraryItemProps) {
//     return( <div className=" flex gap-[10px] items-center border-[1px] border-[#ddd] w-full rounded-[12px]">
//         <Image src={imageUrl} art="image" width={110} height={100}/>
//         <div className="flex flex-col text-[16px]">
//             <Image src={iconUrl} art="icon" width={18} height={18}/>
//             <span className="mt-[8px] font-semibold">{title}</span>
//             <span className="text-[#666] text-[14px]">{description}</span>
//         </div>
//     </div>)
// }
"use client";
import Image from "next/image";

interface ItineraryItemProps {
  imageUrl: string;
  iconUrl: string;
  title: string;
  description: string;
  index: number;
  isLast: boolean;
  category: string;
}

const specialColors: Record<string, string> = {
  음식점: "bg-[#FF9300]",
  쇼핑: "bg-[#00B173]",
};

export default function ItineraryItem({
  imageUrl,
  iconUrl,
  title,
  description,
  index,
  isLast,
  category,
}: ItineraryItemProps) {
  const badgeColor = specialColors[category] || "bg-[#5E0E8C]";

  return (
    <div className="flex w-full items-start gap-[20px]">
      {/* 1. 원래 사용하시던 카드 UI 구조 그대로 복구 */}
      <div className="flex w-full items-center gap-[10px] rounded-[12px] border-[1px] border-[#ddd]">
        <div className="relative h-[100px] w-[110px] shrink-0 overflow-hidden rounded-l-[12px]">
          <Image src={imageUrl} alt="image" fill className="object-cover" />
        </div>
        <div className="flex flex-col text-[16px]">
          <Image src={iconUrl} alt="icon" width={18} height={18} />
          <span className="mt-[8px] font-semibold">{title}</span>
          <span className="text-[14px] text-[#666]">{description}</span>
        </div>
      </div>

      {/* 2. 오른쪽 숫자 및 점선 영역 */}
      <div className="flex shrink-0 flex-col items-center">
        {" "}
        {/* w-[24px] 제거 */}
        <div
          className={`flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full font-bold text-white ${badgeColor}`}
          style={{ fontSize: "14px", lineHeight: "1", paddingTop: "1px", paddingLeft: "1px" }}
        >
          {index + 1}
        </div>
        {!isLast && (
          <div className="mt-2 h-[80px] w-[1px] border-l-[1px] border-dashed border-[#ddd]"></div>
        )}
      </div>
    </div>
  );
}
