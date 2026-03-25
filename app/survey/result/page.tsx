// "use client";

// import DayTab from "./_components/DayTab";
// import { sampleItinerary } from "../mock/itinerary";
// import { useState } from "react";
// import DailySummary from "./_components/DailySummary";
// import ItineraryItem from "./_components/ItineraryItem";
// import Image from "next/image";
// import Button from "@/app/main/_components/Button";
// import dynamic from "next/dynamic";

// // Leaflet은 브라우저에서만 동작하므로 dynamic import 필수
// const ItineraryMap = dynamic(() => import("./_components/ItineraryMap"), {
//   ssr: false,
//   loading: () => (
//     <div className="flex h-full items-center justify-center text-[#999]">지도 로딩 중...</div>
//   ),
// });

// export default function SurveyResult() {
//   const [activeDay, setActiveDay] = useState(1);

//   const currentDayData = sampleItinerary.find((d) => d.day === activeDay);
//   const currentSchedules = currentDayData?.schedules ?? [];

//   return (
//     <div className="flex h-screen">
//       {/* 왼쪽: 일정 리스트 */}
//       <div className="relative w-1/2 overflow-y-auto px-[40px] pt-[50px]">
//         <Image
//           src="/survey/share.svg"
//           alt="share"
//           width={24}
//           height={24}
//           className="absolute top-0 right-[20px] cursor-pointer"
//         />
//         <div className="mx-auto flex max-w-[600px] flex-col items-center gap-[10px]">
//           <div className="relative mb-[14px] h-[140px] w-[140px] overflow-hidden rounded-full bg-[#ddd]">
//             <Image src="/survey/japen.png" alt="japen" fill className="object-cover" />
//           </div>

//           <span className="text-[16px] font-medium text-[#999]">일본</span>

//           <div className="text-center text-[32px] leading-snug text-[#666]">
//             <div>
//               지역은 <span className="font-semibold text-[#222222]">도쿄</span>,
//             </div>
//             <div>
//               일정은 <span className="font-semibold text-[#222222]">5박 6일</span>입니다.
//             </div>
//           </div>

//           <div className="w-full">
//             <div className="flex gap-[16px]">
//               {sampleItinerary.map((i) => (
//                 <DayTab
//                   key={i.day}
//                   day={i.day}
//                   isActive={activeDay === i.day}
//                   onClick={() => setActiveDay(i.day)}
//                 />
//               ))}
//             </div>
//           </div>

//           <DailySummary toure="3" />

//           {currentSchedules.map((schedule, idx) => (
//             <ItineraryItem
//               key={schedule.id}
//               imageUrl={schedule.image}
//               title={schedule.name}
//               description={schedule.subcategory}
//               iconUrl={`/survey/${schedule.icon}`}
//               category={schedule.category}
//               index={idx}
//               isLast={idx === currentSchedules.length - 1}
//             />
//           ))}

//           <div className="mt-[40px] mb-[40px] flex w-full flex-col gap-[10px] text-center">
//             <span className="text-[18px] font-semibold">이 일정이 마음에 드시나요?</span>
//             <span className="text-[16px] text-[#666]">
//               로그인 후 내 일정으로 저장하면 언제든 확인하고 편집할 수 있어요.
//             </span>
//             <div className="mt-[10px] flex gap-[20px]">
//               <Button text="내 일정으로 저장" color="메인" />
//               <Button text="다시 추천받기" color="회색" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 오른쪽: 지도 */}
//       <div className="sticky top-0 h-screen w-1/2">
//         <ItineraryMap schedules={currentSchedules} />
//       </div>
//     </div>
//   );
// }

"use client";

import DayTab from "./_components/DayTab";
import { sampleItinerary } from "../mock/itinerary";
import { useState } from "react";
import DailySummary from "./_components/DailySummary";
import ItineraryItem from "./_components/ItineraryItem";
import Image from "next/image";
import Button from "@/app/main/_components/Button";
import dynamic from "next/dynamic";

// Leaflet은 브라우저에서만 동작하므로 dynamic import 필수
const ItineraryMap = dynamic(() => import("./_components/ItineraryMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-[#999]">지도 로딩 중...</div>
  ),
});

export default function SurveyResult() {
  const [activeDay, setActiveDay] = useState(1);

  const currentDayData = sampleItinerary.find((d) => d.day === activeDay);
  const currentSchedules = currentDayData?.schedules ?? [];

  // 공유하기 기능 함수
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "베리트립 - 나의 일본 여행 일정",
          text: "제가 만든 도쿄 5박 6일 일정을 확인해보세요!",
          url: window.location.href,
        });
      } catch (error) {
        console.error("공유 실패:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("링크가 클립보드에 복사되었습니다!");
      } catch (err) {
        alert("이 브라우저에서는 공유 기능을 사용할 수 없습니다.");
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* 왼쪽: 일정 리스트 (원래 UI 유지) */}
      <div className="relative w-1/2 overflow-y-auto px-[40px] pt-[50px]">
        {/* 공유 아이콘: 원래 위치와 스타일 유지 + onClick만 추가 */}
        <Image
          src="/survey/share.svg"
          alt="share"
          width={24}
          height={24}
          className="absolute top-[50px] right-[40px] cursor-pointer transition-opacity hover:opacity-70"
          onClick={handleShare}
        />

        <div className="mx-auto flex max-w-[600px] flex-col items-center gap-[10px]">
          <div className="relative mb-[14px] h-[140px] w-[140px] overflow-hidden rounded-full bg-[#ddd]">
            <Image src="/survey/japen.png" alt="japen" fill className="object-cover" />
          </div>

          <span className="text-[16px] font-medium text-[#999]">일본</span>

          <div className="text-[#666 ] mb-[34px] text-center text-[32px] leading-snug">
            <div>
              지역은 <span className="font-semibold text-[#222222]">도쿄</span>,
            </div>
            <div>
              일정은 <span className="font-semibold text-[#222222]">5박 6일</span>입니다.
            </div>
          </div>
          <div className="flex w-full flex-col gap-[20px]">
            {/* 1. 날짜 탭 부분 */}
            <div className="w-full">
              <div className="flex gap-[16px]">
                {sampleItinerary.map((i) => (
                  <DayTab
                    key={i.day}
                    day={i.day}
                    isActive={activeDay === i.day}
                    onClick={() => setActiveDay(i.day)}
                  />
                ))}
              </div>
            </div>

            {/* 2. 요약 부분 */}
            <DailySummary toure="3" />

            {/* 3. 일정 리스트 부분 - 이들을 별도의 flex-col로 한 번 더 묶어주는 것이 관리하기 편합니다 */}
            <div className="flex w-full flex-col gap-[16px]">
              {currentSchedules.map((schedule, idx) => (
                <ItineraryItem
                  key={schedule.id}
                  imageUrl={schedule.image}
                  title={schedule.name}
                  description={schedule.subcategory}
                  iconUrl={`/survey/${schedule.icon}`}
                  category={schedule.category}
                  index={idx}
                  isLast={idx === currentSchedules.length - 1}
                />
              ))}
            </div>
          </div>

          <div className="mt-[40px] mb-[40px] flex w-full flex-col gap-[10px] text-center">
            <span className="text-[18px] font-semibold">이 일정이 마음에 드시나요?</span>
            <span className="text-[16px] text-[#666]">
              로그인 후 내 일정으로 저장하면 언제든 확인하고 편집할 수 있어요.
            </span>
            <div className="mt-[10px] flex gap-[20px]">
              <Button text="내 일정으로 저장" color="메인" />
              <Button text="다시 추천받기" color="회색" />
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽: 지도 (원래 UI 유지) */}
      <div className="sticky top-0 h-screen w-1/2">
        <ItineraryMap schedules={currentSchedules} />
      </div>
    </div>
  );
}
