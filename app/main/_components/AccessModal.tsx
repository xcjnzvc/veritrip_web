import Image from "next/image"; // Image 컴포넌트 추가
import Button from "./Button";

interface AccessModalProps {
  onClose: () => void;
  onLoginClick: () => void;
  onQuickPlanClick: () => void;
}

export default function AccessModal({
  onClose,
  onLoginClick,
  onQuickPlanClick,
}: AccessModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-[40px] pt-[50px] rounded-2xl max-w-[400px] w-full flex flex-col items-center gap-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 아이콘 추가 */}
        <Image
          src="/icon/cancel.svg"
          alt="close"
          width={20}
          height={20}
          className="absolute top-[20px] right-[20px] cursor-pointer hover:opacity-70 transition-opacity"
          onClick={onClose}
        />

        <div className="text-center gap-2 flex flex-col">
          <h3 className="text-[20px] font-bold text-[#222]">
            더 스마트한 여행 설계
          </h3>
          <p className="text-[14px] text-[#666] leading-relaxed">
            자유로운 AI 채팅 플래닝은{" "}
            <span className="font-semibold text-[#5E0E8C]">프리미엄</span> 전용
            기능입니다.
            <br />
            로그인하고 실시간 맞춤 일정을 만들어보세요!
          </p>
        </div>

        <div className="flex flex-col gap-[10px] w-full">
          <Button
            text="로그인하고 시작하기"
            color="로그인"
            onClick={() => {
              onClose();
              onLoginClick();
            }}
          />
          <button
            className="w-full py-[14px] text-[15px] font-medium text-[#888] border border-[#e2e2e2] rounded-lg hover:bg-gray-50 transition-colors"
            onClick={onQuickPlanClick}
          >
            무료로 빠르게 일정 짜기
          </button>
        </div>
      </div>
    </div>
  );
}
