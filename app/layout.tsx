import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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

export const metadata: Metadata = {
  title: "VERITRIP",
  description: "VERITRIP에 대한 소개",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body className={`${pretendard.variable} font-pretendard antialiased`}>
        <AuthProvider>
          <Header />

          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>

        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
