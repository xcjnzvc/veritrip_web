"use client";

import Link from "next/link";
import LoginModal from "@/app/main/_components/LoginModal";
import Image from "next/image";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import UserInfoBox from "@/app/main/_components/UserInfo";
import ProgressBar from "@/app/survey/_components/ProgressBar";

export default function Header() {
  const { accessToken, user } = useAuthStore();
  // const { step } = useSurveyStore();
  const isLoggedIn = !!accessToken;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(false);

  // const totalSteps = surveyMockData.steps.length;

  const displayUserName = user?.name
    ? user.name.length > 2
      ? user.name.slice(1)
      : user.name
    : "";

  return (
    <div className="px-[40px] py-[8px] flex justify-between items-center">
      <div className="font-bold text-[16px] text-[#666666]">VERITRIP</div>
      <div className="flex items-center gap-[14px]">
        <Image
          src="/icon/mode-light.svg"
          alt="Mode Light Icon"
          width={24}
          height={24}
        />
        {isLoggedIn ? (
          /* 이 div가 relative이면서 동시에 '자리를 차지하는 방식'이 헤더 레이아웃을 방해하지 않아야 합니다 */
          <div className="relative flex items-center  ">
            <button
              className="border border-[#ddd] w-[44px] h-[44px] rounded-full bg-[#F4F4F4] text-[12px] font-bold"
              onClick={() => setUserInfo(true)}
            >
              {displayUserName}
            </button>

            {/* UserInfoBox는 여기서 absolute여야 헤더 높이에 영향을 주지 않습니다 */}
            {userInfo && <UserInfoBox onClose={() => setUserInfo(false)} />}
          </div>
        ) : (
          <button
            className="font-bold text-[14px] text-[#ffffff] bg-[#222222] px-[14px] py-[8px] rounded-[100px]"
            onClick={() => setIsModalOpen(true)}
          >
            LOGIN
          </button>
        )}
      </div>
      {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />}
    </header>
  );
}
