"use client";

import Image from "next/image";
import SurveyTitle from "./_components/SurveyTitle";
import SurveyContent from "./_components/SurveyContent";
import Button from "../main/_components/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { getSurvey, submitSurvey } from "@/lib/api/survey";
import { useQuery } from "@tanstack/react-query";

const STEP_KEY: Record<number, string> = {
  1: "destination",
  2: "duration",
  3: "companion",
  4: "theme",
  5: "dislike",
  6: "travelStyle",
};

interface SurveyResponse {
  totalSteps: number;
  steps: SurveyStep[];
}

export interface SurveyStep {
  orderNumber: number;
  title: string;
  description?: string;
  type: "single_select" | "multi_select";
  options: SurveyOption[];
}

export interface SurveyOption {
  id: string;
  label: string;
  children?: SurveyOption[];
}

export default function Survey() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = Number(searchParams.get("step") ?? "1");

  const {
    data: surveyData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["survey"],
    queryFn: async () => {
      const res = await getSurvey();
      return res.data.data;
    },
  });

  console.log("surveyData", surveyData);

  const currentStep = surveyData?.steps.find(
    (s: SurveyStep) => s.orderNumber === step,
  );
  const totalSteps = surveyData?.totalSteps;

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러가 발생했습니다.</div>;
  if (!currentStep) return null;

  const key = STEP_KEY[step];
  const rawValue = searchParams.get(key) ?? "";
  const selected = rawValue ? rawValue.split(",") : [];

  const handleSelected = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentStep.type === "multi_select") {
      const next = selected.includes(name)
        ? selected.filter((item) => item !== name)
        : [...selected, name];
      params.set(key, next.join(","));
    } else {
      params.set(key, name);
    }
    router.replace(`/survey?${params.toString()}`);
  };

  const handleNextAction = async () => {
    if (step === totalSteps) {
      const params = new URLSearchParams(searchParams.toString());

      // URL 쿼리스트링에서 값 꺼내서 백엔드 형식으로 변환
      const payload = {
        typeId: 1,
        answers: [
          { answer: params.get("destination"), orderNumber: 1 },
          { answer: params.get("duration"), orderNumber: 2 },
          { answer: params.get("companion"), orderNumber: 3 },
          { answer: params.get("theme"), orderNumber: 4 },
          { answer: params.get("dislike"), orderNumber: 5 },
          { answer: params.get("travelStyle"), orderNumber: 6 },
        ],
      };

      console.log("🚀 백엔드로 보낼 최종 데이터:", payload);
      await submitSurvey(payload); // ← 여기서 API 호출
      router.push("/result"); // ← 결과 페이지로 이동
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", String(step + 1));
      router.push(`/survey?${params.toString()}`);
    }
  };

  const handlePrevAction = () => {
    if (step === 1) return;
    router.back();
  };

  return (
    <div className="max-w-[1000px] mx-auto">
      <button onClick={handlePrevAction} className="py-4">
        <Image
          src="/icon/arrow-bold.svg"
          alt="arrow-left"
          width={24}
          height={24}
        />
      </button>

      <SurveyTitle
        step={currentStep.orderNumber}
        totalSteps={totalSteps ?? 6}
        title={currentStep.title}
        description={currentStep.description}
      />

      <div className="flex flex-col gap-[70px] mt-[70px] mb-[140px]">
        {currentStep.options.some(
          (opt: SurveyOption) => opt.children && opt.children.length > 0,
        ) ? (
          currentStep.options.map(
            (option: SurveyOption) =>
              option.children &&
              option.children.length > 0 && (
                <SurveyContent
                  key={option.id}
                  title={option.label}
                  badges={option.children.map(
                    (child: SurveyOption) => child.label,
                  )}
                  onSelected={handleSelected}
                  selected={selected}
                />
              ),
          )
        ) : (
          <SurveyContent
            onSelected={handleSelected}
            selected={selected}
            badges={currentStep.options.map(
              (option: SurveyOption) => option.label,
            )}
          />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-[1000px] mx-auto">
          <div className="bg-gradient-to-t from-white via-white to-transparent pt-[40px] pb-[40px]">
            <Button
              text={step === totalSteps ? "제출하기" : "다음"}
              color="메인"
              textSize="text-[20px]"
              onClick={handleNextAction}
              disabled={selected.length === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
