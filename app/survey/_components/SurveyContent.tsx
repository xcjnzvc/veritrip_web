import { useSurveyStore } from "@/store/useSurveyStore";

interface SurveyContent {
  title?: string;
  badges: string[];
}

export default function SurveyContent({ title, badges }: SurveyContent) {
  const { step } = useSurveyStore();

  const isFullRow = step === 6 && badges.length === 3;

  return (
    <div className="flex flex-col gap-[22px]">
      {title && <h4 className="text-lg font-bold">{title}</h4>}
      <div className="flex flex-wrap gap-[10px]">
        {badges.map((name, index) => (
          <Badge key={index} name={name} isFullWidth={isFullRow} />
        ))}
      </div>
    </div>
  );
}

function Badge({ name, isFullWidth }: { name: string; isFullWidth?: boolean }) {
  return (
    <div
      className={`
          flex  items-center justify-center py-[14px] bg-[#F6F6F6] rounded-full text-[18px] text-[#222]
          ${isFullWidth ? "flex-1" : "min-w-[192px]"} 
        `}
    >
      {name}
    </div>
  );
}
