"use client";

import LoginModal from "@/app/main/_components/LoginModal";
import Image from "next/image";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import UserInfoBox from "@/app/main/_components/UserInfo";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  const { accessToken, user } = useAuthStore();
  const isLoggedIn = !!accessToken;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const displayUserName = user?.name ? (user.name.length > 2 ? user.name.slice(1) : user.name) : "";

  return (
    <div className="flex items-center justify-between px-[40px] py-[8px]">
      <Link href="/" className="cursor-pointer">
        <div className="text-[16px] font-bold text-[#666666] transition-opacity hover:opacity-80">
          VERITRIP
        </div>
      </Link>
      <div className="flex items-center gap-[14px]">
        <Image src="/icon/mode-light.svg" alt="Mode Light Icon" width={24} height={24} />
        {isLoggedIn ? (
          <div className="relative flex items-center">
            <button
              className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[#ddd] bg-[#F4F4F4] text-[12px] font-bold"
              onClick={() => setUserInfo(true)}
            >
              {displayUserName}
            </button>

            {userInfo && (
              <>
                {/* 투명한 backdrop - 클릭하면 닫힘 */}
                <div className="fixed inset-0 z-40" onClick={() => setUserInfo(false)} />
                <UserInfoBox onClose={() => setUserInfo(false)} />
              </>
            )}
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
    </div>
  );
}
