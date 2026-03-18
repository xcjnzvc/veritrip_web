"use client";

interface SurveyTitleProps {
  step: number;
  totalSteps: number;
  title: string;
  description?: string;
}

export default function SurveyTitle({
  step,
  totalSteps,
  title,
  description,
}: SurveyTitleProps) {
  return (
    <div className="mt-[70px] flex flex-col gap-[8px]">
      {/* 01 / 06 부분: 디자인에 맞춰 보라색 강조 */}
      <p className="text-[#5E0E8C] font-extrabold text-[28px]">
        {step < 10 ? `0${step}` : step}
        <span className="text-[#999999] font-medium text-[18px] ">
          / {totalSteps < 10 ? `0${totalSteps}` : totalSteps}
        </span>
      </p>

      {/* 질문 제목 */}
      <h1 className="text-[30px] font-semibold text-[#222222] leading-[1.4]">
        {title}
      </h1>

      {/* 부연 설명: 있을 때만 렌더링 */}

      <p className="text-[#999999] text-[18px]">{description}</p>
    </div>
  );
}
