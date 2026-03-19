"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Settings, ArrowUpCircle, HelpCircle, LogOut } from "lucide-react";

export default function UserInfoBox({ onClose }: { onClose: () => void }) {
  const { setLogout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    setLogout();
    toast.success("로그아웃 되었습니다.");
    router.push("/");
    onClose();
  };

  const email = user?.email || "rkdenrjd@gmail.com";
  const [localPart, domainPart] = email.split("@");

  const menuItemClass =
    "flex items-center gap-[8px] w-full text-[14px] text-vt-gray-900 hover:bg-vt-gray-100 rounded-lg transition-colors text-left";

  return (
    <div
      className="absolute top-full right-0 z-50 flex w-max min-w-[220px] flex-col gap-[20px] overflow-hidden rounded-[12px] border border-[#ddd] bg-[#f9f9f9] px-[10px] py-[20px] shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 상단 프로필 섹션 */}
      <div className="flex flex-col gap-[8px]">
        <span className="text-vt-primary self-start rounded-full bg-[#F0EAF5] px-[10px] py-[4px] text-[12px] font-bold">
          무료
        </span>
        <p className="text-vt-gray-900 text-[14px] font-normal break-all">
          {localPart}
          {domainPart && (
            <>
              <wbr />@{domainPart}
            </>
          )}
        </p>
      </div>

      {/* 구분선 */}
      <div className="h-[1px] w-full bg-[#ddd]" />

      {/* 메뉴 섹션 */}
      <div className="flex flex-col gap-[14px]">
        <button className={menuItemClass}>
          <Settings size={16} />
          <span>설정</span>
        </button>
        <button className={menuItemClass}>
          <ArrowUpCircle size={16} />
          <span>요금제 업그레이드</span>
        </button>
        <button className={menuItemClass}>
          <HelpCircle size={16} />
          <span>도움말</span>
        </button>
      </div>

      {/* 구분선 */}
      <div className="h-[1px] w-full bg-[#ddd]" />

      {/* 로그아웃 섹션 */}
      <div className="">
        <button onClick={handleLogout} className={menuItemClass}>
          <LogOut size={16} />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
}
