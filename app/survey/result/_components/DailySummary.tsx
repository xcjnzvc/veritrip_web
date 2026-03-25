import Image from "next/image"; 

interface DailySummaryProps{
    toure: string
}

export default function DailySummary({toure}:DailySummaryProps){
    return(
        <div className="border-[1px] border-[#ddd] bg-[#f9f9f9] rounded-[12px] py-[18px] px-[14px] w-full flex gap-[13px]">
            <div className="w-[40px] h-[40px] bg-[#666] rounded-full flex items-center justify-center">
            <Image 
  src="/icon/calendar.svg" 
  alt="calender" 
  width={24}   // 숫자로만 적습니다 (px 생략)
  height={24} 
/>
            </div>
            <div className="flex flex-col gqp-[4px]">
            <span className="font-semibold text-[16px]">오늘은 총 {}개의 일정이있습니다.</span>
            <div className="font-[14px] text-[#666]">
                관광 <span className="text-[#5E0E8C]">{toure}</span>곳, 
                맛집 <span className="text-[#FF9300]">{toure}</span>곳, 
                쇼핑 <span className="text-[#00B173]">{toure}</span>곳 입니다.</div>
            </div>
        </div>
    )
}