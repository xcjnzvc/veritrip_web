import Image from "next/image"; 
import Button from "./Button";

interface AccessModalProps {
  onClose: () => void;
  onLoginClick: () => void;
  onQuickPlanClick: () => void;
}

export default function AccessModal({ onClose, onLoginClick, onQuickPlanClick }: AccessModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-[400px] flex-col items-center gap-[24px] rounded-2xl bg-white p-[40px] pt-[50px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 아이콘 추가 */}
        <Image
          src="/icon/cancel.svg"
          alt="close"
          width={20}
          height={20}
          className="absolute top-[20px] right-[20px] cursor-pointer transition-opacity hover:opacity-70"
          onClick={onClose}
        />

        <div className="flex flex-col gap-2 text-center">
          <h3 className="text-[20px] font-bold text-[#222]">더 스마트한 여행 설계</h3>
          <p className="text-[14px] leading-relaxed text-[#666]">
            자유로운 AI 채팅 플래닝은 <span className="font-semibold text-[#5E0E8C]">프리미엄</span>{" "}
            전용 기능입니다.
            <br />
            로그인하고 실시간 맞춤 일정을 만들어보세요!
          </p>
        </div>

        <div className="flex w-full flex-col gap-[10px]">
          <Button
            text="로그인하고 시작하기"
            color="메인"
            onClick={() => {
              onClose();
              onLoginClick();
            }}
          />
          <button
            className="w-full rounded-lg border border-[#e2e2e2] py-[14px] text-[15px] font-medium text-[#888] transition-colors hover:bg-gray-50"
            onClick={onQuickPlanClick}
          >
            무료로 빠르게 일정 짜기
          </button>
        </div>
      </div>
    </div>
  );
}
