"use client";
import Header from "@/components/Header";
import SearchKeywordTag from "./_components/SearchKeywordTag";
import SearchBar from "./_components/SearchBar";
import { useAuthStore } from "@/store/useAuthStore";

export default function MainPageContent() {
  const { accessToken, user } = useAuthStore();
  const isLoggedIn = !!accessToken; // accessToken 있으면 true, null이면 false
  const userName = user?.name || "";

  const tagKeyWords = [
    "실시간 핫플레이스",
    "느좋 카페",
    "꼭 가봐야할 명소",
    "맛집 탐방",
  ];

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      {/* 1. justify-center를 빼고 pt-[20vh]를 줬습니다.
        2. 20vh는 화면 높이의 20%만큼 위에서 띄운다는 뜻이라, 
           완전 중앙보다 살짝 위에 위치하게 되어 시각적으로 더 안정적입니다.
      */}
      <section className="flex-1 flex flex-col items-center pt-[30vh] px-[40px] ">
        <div className="flex flex-col items-center gap-[16px] w-full">
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
          <SearchBar />
          {isLoggedIn ? (
            <div className="flex gap-5">
              {tagKeyWords.map((keyword, index) => (
                <SearchKeywordTag key={index} text={keyword} />
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-[#999]">
              현재 체험판을 이용중이므로{" "}
              <a
                href="/recommend"
                className="text-[#666] text-[14px] font-semibold underline"
              >
                바로 추천받기
              </a>
              만 가능합니다.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
