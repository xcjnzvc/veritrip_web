import LoginModal from "@/app/main/_components/LoginModal";
import Image from "next/image";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import UserInfoBox from "@/app/main/_components/UserInfo";

export default function Header() {
  const { accessToken, user } = useAuthStore();
  const isLoggedIn = !!accessToken; // accessToken 있으면 true, null이면 false
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  const displayUserName = user?.name
    ? user.name.length > 2
      ? user.name.slice(1) // 성을 떼고 나머지 (강수정 -> 수정) [cite: 2026-03-09]
      : user.name // 두 글자 이하면 그대로 (이정 -> 이정) [cite: 2026-03-09]
    : "";

  return (
    <div className="flex items-center justify-between px-[40px] py-[8px]">
      <div className="text-[16px] font-bold text-[#666666]">VERITRIP</div>
      <div className="flex items-center gap-[14px]">
        <Image src="/icon/mode-light.svg" alt="Mode Light Icon" width={24} height={24} />
        {isLoggedIn ? (
          /* 이 div가 relative이면서 동시에 '자리를 차지하는 방식'이 헤더 레이아웃을 방해하지 않아야 합니다 */
          <div className="relative flex items-center">
            <button
              className="h-[44px] w-[44px] rounded-full border border-[#ddd] bg-[#F4F4F4] text-[12px] font-bold"
              onClick={() => setUserInfo(true)}
            >
              {displayUserName}
            </button>

            {/* UserInfoBox는 여기서 absolute여야 헤더 높이에 영향을 주지 않습니다 */}
            {userInfo && <UserInfoBox onClose={() => setUserInfo(false)} />}
          </div>
        ) : (
          <button
            className="rounded-[100px] bg-[#222222] px-[14px] py-[8px] text-[14px] font-bold text-[#ffffff]"
            onClick={() => setIsModalOpen(true)}
          >
            LOGIN
          </button>
        )}
      </div>
      {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />}
      {/* {userInfo && <UserInfoBox onClose={() => setUserInfo(false)} />} */}
    </div>
  );
}
