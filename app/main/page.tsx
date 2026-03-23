"use client";
import Header from "@/components/Header";
import SearchKeywordTag from "./_components/SearchKeywordTag";
import SearchBar from "./_components/SearchBar";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import AccessModal from "./_components/AccessModal";
import { useRouter } from "next/navigation";
import LoginModal from "./_components/LoginModal";

export default function MainPageContent() {
  const router = useRouter();
  const { accessToken, user } = useAuthStore();
  const isLoggedIn = !!accessToken; // accessToken 있으면 true, null이면 false
  const userName = user?.name || "";
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // useEffect()=>{
  //   console.log
  // }

  const handleSearchClick = () => {
    if (!isLoggedIn) {
      // 로그인 안 되어 있으면 모달 오픈
      setIsAccessModalOpen(true);
    }
    // 로그인 되어 있으면 아무 처리 안 함 (기본 input 기능 동작)
  };

  const tagKeyWords = ["실시간 핫플레이스", "느좋 카페", "꼭 가봐야할 명소", "맛집 탐방"];

  return (
    <main className="flex min-h-screen flex-col">
      {/* <Header /> */}
      {/* 1. justify-center를 빼고 pt-[20vh]를 줬습니다.
        2. 20vh는 화면 높이의 20%만큼 위에서 띄운다는 뜻이라, 
           완전 중앙보다 살짝 위에 위치하게 되어 시각적으로 더 안정적입니다.
      */}
      <section className="flex flex-1 flex-col items-center px-[40px] pt-[30vh]">
        <div className="flex w-full flex-col items-center gap-[16px]">
          <h1 className="text-[28px] text-[#222]">
            {isLoggedIn ? (
              <>
                어서오세요 <span className="font-semibold">{userName}</span>
                님, 어떤 여행을 해볼까요?
              </>
            ) : (
              "어서오세요, 어떤 여행을 해볼까요?"
            )}
          </h1>

          <SearchBar onClick={handleSearchClick} readOnly={!isLoggedIn} />

          {isLoggedIn ? (
            <div className="flex gap-5">
              {tagKeyWords.map((keyword, index) => (
                <SearchKeywordTag key={index} text={keyword} />
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-[#999]">
              현재 체험판을 이용중이므로{" "}
              <a href="/recommend" className="text-[14px] font-semibold text-[#666] underline">
                바로 추천받기
              </a>
              만 가능합니다.
            </p>
          )}
        </div>
      </section>
      {isAccessModalOpen && (
        <AccessModal
          onClose={() => setIsAccessModalOpen(false)}
          onLoginClick={() => setIsLoginModalOpen(true)} // 여기서 로그인 모달을 켭니다
          onQuickPlanClick={() => router.push("/survey")} // 질문 페이지로 이동
        />
      )}

      {/* 3. 기존 로그인 모달 */}
      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
    </main>
  );
}
