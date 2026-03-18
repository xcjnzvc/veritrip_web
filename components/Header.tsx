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
    <header className="relative w-full bg-white">
      <div className="px-[40px] py-[8px] flex justify-between items-center h-[60px]">
        <Link href="/">
          <div className="font-bold text-[16px] text-[#666666] cursor-pointer">
            VERITRIP
          </div>
        </Link>
        <div className="flex items-center gap-[14px]">
          <Image
            src="/icon/mode-light.svg"
            alt="Mode Light Icon"
            width={24}
            height={24}
          />
          {isLoggedIn ? (
            <div className="relative flex items-center">
              <button
                className="border border-[#ddd] w-[44px] h-[44px] rounded-full bg-[#F4F4F4] text-[12px] font-bold"
                onClick={() => setUserInfo(true)}
              >
                {displayUserName}
              </button>
              {userInfo && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserInfo(false)}
                />
              )}
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
      </div>

      {/* 헤더 바닥에 딱 붙도록 배치 */}
      {/* {isSurveyPage && (
        // bottom-0으로 주면 헤더의 border-b와 겹치거나 그 바로 위에 위치합니다.
        <div className="absolute bottom-0 left-0 w-full z-[110]">
          <ProgressBar step={step} totalSteps={totalSteps} />
        </div>
      )} */}

      {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />}
    </header>
  );
}
