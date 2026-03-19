"use client";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

export default function ProgressBar({ step, totalSteps }: ProgressBarProps) {
  // 너비 계산
  const progress = (step / totalSteps) * 100;

  return (
    // 배경색 제거, 높이 유지, 양끝 둥글게 처리
    <div className="w-full h-[4px] rounded-full overflow-hidden">
      <div
        className="h-full transition-all duration-500 ease-out rounded-full"
        style={{
          width: `${progress}%`,
          backgroundColor: "#5E0E8C",
        }}
      />
    </div>
  );
}
