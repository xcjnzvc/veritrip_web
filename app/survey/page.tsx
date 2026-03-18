"use client";

import { surveyMockData } from "@/lib/survey.mock";
import SurveyTitle from "./_components/SurveyTitle";
import { useSurveyStore } from "@/store/useSurveyStore";
import SurveyContent from "./_components/SurveyContent";
import { useEffect } from "react";
import Button from "../main/_components/Button";

export default function Survey() {
  const { step, prevStep, nextStep } = useSurveyStore();

  // step 번호로 현재 스텝 데이터 꺼내기
  const currentStep = surveyMockData.steps.find((s) => s.id === step);

  //   useEffect();
  console.log("currentStep", currentStep);
  console.log("currentStep.options", currentStep?.options);

  if (!currentStep) return null;

  //   const handleNext = () => {};

  return (
    <div className="max-w-[1000px] mx-auto">
      <button onClick={prevStep}>뒤로</button>
      <SurveyTitle
        step={currentStep.id}
        totalSteps={currentStep.totalSteps}
        title={currentStep.title}
        description={currentStep.description}
      />
      <div className="flex flex-col gap-[70px] mt-[70px] mb-[140px]">
        {/* 1. 자식이 있는 경우 (일본, 베트남 등) - 국가별로 상자를 따로 만듦 */}
        {currentStep.options.some((opt) => "children" in opt) ? (
          currentStep.options.map(
            (option) =>
              "children" in option && (
                <SurveyContent
                  key={option.id}
                  title={option.label}
                  badges={option.children.map((child) => child.label)}
                />
              ),
          )
        ) : (
          /* 2. 자식이 없는 경우 (당일치기, 1박2일 등) - 하나의 상자에 모든 배지를 담음 */
          <SurveyContent
            badges={currentStep.options.map((option) => option.label)}
          />
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-[1000px] mx-auto">
          {/* 그라데이션 + 흰 배경 */}
          <div className="bg-gradient-to-t from-white via-white to-transparent pt-[40px] pb-[40px]">
            <Button
              text="다음"
              color="메인"
              textSize="text-[20px]"
              onClick={nextStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
