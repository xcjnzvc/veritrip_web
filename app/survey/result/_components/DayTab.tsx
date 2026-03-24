"use client";

interface DayTabProps {
  day: number;
  isActive: boolean;
  onClick: () => void;
}

export default function DayTab({ day, isActive, onClick }: DayTabProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-[72px] text-[16px] shrink-0 py-2.5 rounded-xl transition-all duration-150 border-0 cursor-pointer
        ${isActive 
          ? "bg-[#5E0E8C] text-white font-semibold" 
          : "bg-transparent text-[#666] hover:text-[#5E0E8C]" 
        }
      `}
    >
      Day {day}
    </button>
  );
}