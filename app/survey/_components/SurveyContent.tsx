import { useSearchParams } from "next/navigation";

interface SurveyContent {
  title?: string;
  badges: string[];
  onSelected: (name: string) => void;
  selected: string[];
}

export default function SurveyContent({
  title,
  badges,
  onSelected,
  selected,
}: SurveyContent) {
  const searchParams = useSearchParams();
  const step = Number(searchParams.get("step") ?? "1");

  const isFullRow = step === 6 && badges.length === 3;

  return (
    <div className="flex flex-col gap-[22px]">
      {title && <h4 className="text-lg font-bold">{title}</h4>}
      <div className="flex flex-wrap gap-[10px]">
        {badges.map((name, index) => (
          <Badge
            key={index}
            name={name}
            isFullWidth={isFullRow}
            isActive={selected.includes(name)}
            onSelected={onSelected}
          />
        ))}
      </div>
    </div>
  );
}

function Badge({
  name,
  isFullWidth,
  onSelected,
  isActive,
}: {
  name: string;
  isFullWidth?: boolean;
  onSelected: (name: string) => void;
  isActive: boolean;
}) {
  return (
    <div
      // ✅ 5. 클릭 시 복잡한 e 대신 자기 이름(name)을 부모에게 던짐
      onClick={() => onSelected(name)}
      className={`
          flex items-center justify-center py-[14px] rounded-full text-[18px] cursor-pointer transition-all
          ${isFullWidth ? "flex-1" : "min-w-[192px]"} 
          ${
            isActive
              ? "bg-white border-[1px] border-[#6A1B9A] text-[#6A1B9A]" // ✅ 6. 선택 시 (흰 배경 + 메인색 스트록/텍스트)
              : "bg-[#F6F6F6] border-[1px] border-transparent text-[#222]"
          } // ✅ 기본 상태
        `}
    >
      {name}
    </div>
  );
}
