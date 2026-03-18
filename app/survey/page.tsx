// "use client";

// import Image from "next/image";
// import { surveyMockData } from "@/lib/survey.mock";
// import SurveyTitle from "./_components/SurveyTitle";
// import { useSurveyStore } from "@/store/useSurveyStore";
// import SurveyContent from "./_components/SurveyContent";
// import Button from "../main/_components/Button";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function Survey() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // ✅ step을 URL에서 읽기 (없으면 1)
//   const step = Number(searchParams.get("step") ?? "1");

//   const { setAnswer, answers } = useSurveyStore();
//   const selected = answers[step] ?? [];

//   const currentStep = surveyMockData.steps.find((s) => s.id === step);
//   const totalSteps = surveyMockData.steps.length;

//   if (!currentStep) return null;

//   const handleSelected = (name: string) => {
//     if (currentStep.type === "multi_select") {
//       const next = selected.includes(name)
//         ? selected.filter((item) => item !== name)
//         : [...selected, name];
//       setAnswer(step, next);
//     } else {
//       setAnswer(step, [name]);
//     }
//   };

//   const handleNextAction = async () => {
//     if (step === totalSteps) {
//       const payload = {
//         destination: answers[1]?.[0],
//         duration: answers[2]?.[0],
//         companion: answers[3]?.[0],
//         theme: answers[4],
//         dislike: answers[5]?.[0],
//         travelStyle: answers[6]?.[0],
//       };
//       console.log("🚀 백엔드로 보낼 최종 데이터:", payload);
//       // await api.post('/survey', payload);
//     } else {
//       router.push(`/survey?step=${step + 1}`);
//     }
//   };

//   const handlePrevAction = () => {
//     if (step === 1) return;
//     router.back(); // ✅ 브라우저 뒤로가기
//   };

//   return (
//     <div className="max-w-[1000px] mx-auto">
//       <button onClick={handlePrevAction} className="py-4">
//         <Image
//           src="/icon/arrow-bold.svg"
//           alt="arrow-left"
//           width={24}
//           height={24}
//         />
//       </button>

//       <SurveyTitle
//         step={currentStep.id}
//         totalSteps={totalSteps}
//         title={currentStep.title}
//         description={currentStep.description}
//       />

//       <div className="flex flex-col gap-[70px] mt-[70px] mb-[140px]">
//         {currentStep.options.some((opt) => "children" in opt) ? (
//           currentStep.options.map(
//             (option) =>
//               "children" in option && (
//                 <SurveyContent
//                   key={option.id}
//                   title={option.label}
//                   badges={option.children.map((child) => child.label)}
//                   onSelected={handleSelected}
//                   selected={selected}
//                 />
//               ),
//           )
//         ) : (
//           <SurveyContent
//             onSelected={handleSelected}
//             selected={selected}
//             badges={currentStep.options.map((option) => option.label)}
//           />
//         )}
//       </div>

//       <div className="fixed bottom-0 left-0 right-0 z-50">
//         <div className="max-w-[1000px] mx-auto">
//           <div className="bg-gradient-to-t from-white via-white to-transparent pt-[40px] pb-[40px]">
//             <Button
//               text={step === totalSteps ? "제출하기" : "다음"}
//               color="메인"
//               textSize="text-[20px]"
//               onClick={handleNextAction}
//               disabled={selected.length === 0}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import { surveyMockData } from "@/lib/survey.mock";
import SurveyTitle from "./_components/SurveyTitle";
import SurveyContent from "./_components/SurveyContent";
import Button from "../main/_components/Button";
import { useRouter, useSearchParams } from "next/navigation";

// step별 쿼리 키 매핑
const STEP_KEY: Record<number, string> = {
  1: "destination",
  2: "duration",
  3: "companion",
  4: "theme",
  5: "dislike",
  6: "travelStyle",
};

export default function Survey() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = Number(searchParams.get("step") ?? "1");

  const currentStep = surveyMockData.steps.find((s) => s.id === step);
  const totalSteps = surveyMockData.steps.length;

  if (!currentStep) return null;

  // ✅ 선택값을 URL 쿼리에서 읽기
  const key = STEP_KEY[step];
  const rawValue = searchParams.get(key) ?? "";
  const selected = rawValue ? rawValue.split(",") : [];

  // ✅ 클릭 시 URL 쿼리에 바로 반영
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
    const params = new URLSearchParams(searchParams.toString());

    if (step === totalSteps) {
      // ✅ 마지막 스텝이면 API 호출
      const payload = {
        destination: params.get("destination"),
        duration: params.get("duration"),
        companion: params.get("companion"),
        theme: params.get("theme")?.split(","),
        dislike: params.get("dislike"),
        travelStyle: params.get("travelStyle"),
      };
      console.log("🚀 백엔드로 보낼 최종 데이터:", payload);
      // await api.post('/survey', payload);
    } else {
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
        step={currentStep.id}
        totalSteps={totalSteps}
        title={currentStep.title}
        description={currentStep.description}
      />

      <div className="flex flex-col gap-[70px] mt-[70px] mb-[140px]">
        {currentStep.options.some((opt) => "children" in opt) ? (
          currentStep.options.map(
            (option) =>
              "children" in option && (
                <SurveyContent
                  key={option.id}
                  title={option.label}
                  badges={option.children.map((child) => child.label)}
                  onSelected={handleSelected}
                  selected={selected}
                />
              ),
          )
        ) : (
          <SurveyContent
            onSelected={handleSelected}
            selected={selected}
            badges={currentStep.options.map((option) => option.label)}
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
