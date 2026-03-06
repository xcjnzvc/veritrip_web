import type { Metadata } from "next";
import localFont from "next/font/local"; // localFont 임포트
import "./globals.css";

// 프리텐다드 폰트 설정 (public/fonts 폴더의 파일들 연결)
const pretendard = localFont({
  src: [
    { path: "../public/fonts/Pretendard-Thin.otf", weight: "100" },
    { path: "../public/fonts/Pretendard-ExtraLight.otf", weight: "200" },
    { path: "../public/fonts/Pretendard-Light.otf", weight: "300" },
    { path: "../public/fonts/Pretendard-Regular.otf", weight: "400" },
    { path: "../public/fonts/Pretendard-Medium.otf", weight: "500" },
    { path: "../public/fonts/Pretendard-SemiBold.otf", weight: "600" },
    { path: "../public/fonts/Pretendard-Bold.otf", weight: "700" },
    { path: "../public/fonts/Pretendard-ExtraBold.otf", weight: "800" },
    { path: "../public/fonts/Pretendard-Black.otf", weight: "900" },
  ],
  variable: "--font-pretendard",
});

// 메타데이터 설정: 여기서 프로젝트의 정체성을 정의합니다.
export const metadata: Metadata = {
  title: "VERITRIP", // 브라우저 탭 제목
  description: "VERITRIP에 대한 소개", // 검색 결과 등에 노출되는 설명
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {" "}
      <body className={`${pretendard.variable} font-pretendard antialiased`}>
        {children}
      </body>
    </html>
  );
}
