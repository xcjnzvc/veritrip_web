"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LoginInput from "./LoginInput";
import Button from "./Button";
import Divider from "./Divider";
import Checkbox from "./Checkbox";
import { loginUser, signin, userInfo } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

interface ApiErrorResponse {
  code: number;
  message: string;
  data: null;
}

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const { setLogin, setUserInfo } = useAuthStore();
  const router = useRouter();

  // 현재 모달이 로그인인지 회원가입인지 상태 관리
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(""); // 회원가입용 이름 추가
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember, setIsRemember] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setIsRemember(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await loginUser(email, password);

      if (result.code === 200) {
        if (isRemember) {
          localStorage.setItem("savedEmail", email);
        } else {
          localStorage.removeItem("savedEmail");
        }

        setLogin(result.data.accessToken);

        const userRes = await userInfo();

        setUserInfo(userRes.data);

        toast.success("로그인이 완료되었습니다!");
        router.push("/main");
        onClose();
      }
    } catch (error: unknown) {
      // 1. 우선 unknown으로 받습니다.

      // 2. axios.isAxiosError 뒤에 <타입>을 붙여서 "이 에러의 데이터는 이 모양이야"라고 알려줍니다.
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        // 3. 이제 여기서 error.response?.data를 치면 code, message가 자동완성됩니다!
        const serverMessage = error.response?.data.message;
        toast.error(serverMessage || "로그인에 실패했습니다.");
      } else {
        toast.error("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 로직 (필요시 구현)
  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      const result = await signin(name, email, password);

      if (result.code === 200) {
        toast.success("회원가입이 완료되었습니다!");
        setIsLoginMode(true);
        setPassword("");
      }
    } catch (error: unknown) {
      // 1. 우선 unknown으로 받습니다.

      // 2. axios.isAxiosError 뒤에 <타입>을 붙여서 "이 에러의 데이터는 이 모양이야"라고 알려줍니다.
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        // 3. 이제 여기서 error.response?.data를 치면 code, message가 자동완성됩니다!
        const serverMessage = error.response?.data.message;
        toast.error(serverMessage || "회원가입에 실패했습니다.");
      } else {
        toast.error("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`relative pt-[66px] pb-[30px] px-[50px] max-w-[500px] w-full flex flex-col items-center rounded-2xl transition-colors duration-300 ${
          isLoginMode ? "bg-white" : "bg-[#1A1A1A]" // 회원가입일 때 어두운 배경
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <Image
          src="/icon/cancel.svg" // 로그인 때 잘 나오던 그 경로 그대로 고정
          alt="cancel"
          width={20}
          height={20}
          // 회원가입 모드일 때만 반전
          className={`absolute top-[20px] right-[20px] cursor-pointer z-[60] ${
            !isLoginMode ? "invert brightness-200" : ""
          }`}
          onClick={onClose}
        />

        <div className="flex flex-col gap-[30px] w-full items-center">
          {/* 헤더 로고 섹션 */}
          <div className="text-center">
            <h2
              className={`text-[26px] font-bold ${isLoginMode ? "text-[#5E0E8C]" : "text-white"}`}
            >
              VERITRIP
            </h2>
            <p
              className={`text-[14px] ${isLoginMode ? "text-[#999]" : "text-[#828282]"}`}
            >
              지금 바로 VERITRIP의 특별한 여정에 합류하세요.
            </p>
          </div>

          {/* 입력 섹션 */}
          <div className="flex flex-col gap-[14px] w-full">
            {!isLoginMode && ( // 회원가입 모드일 때만 이름 입력창 노출
              <LoginInput
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isLoginMode={isLoginMode}
              />
            )}
            <LoginInput
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isLoginMode={isLoginMode}
            />
            <LoginInput
              placeholder="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isLoginMode={isLoginMode}
            />

            <Button
              text={
                isLoading ? "연결 중..." : isLoginMode ? "로그인" : "가입하기"
              }
              color="로그인" // 보라색 버튼 색상은 그대로 유지
              onClick={isLoginMode ? handleLogin : handleSignUp}
              disabled={isLoading}
            />

            {isLoginMode && (
              <div className="flex justify-between items-center px-1">
                <Checkbox
                  label="이메일 저장"
                  checked={isRemember}
                  onChange={() => setIsRemember(!isRemember)}
                />
                <p className="text-[14px] text-[#999] cursor-pointer hover:underline">
                  비밀번호 찾기
                </p>
              </div>
            )}
          </div>

          <Divider />

          {/* 소셜 로그인 섹션 */}
          <div className="flex flex-col gap-[10px] w-full">
            <Button
              text="Google로 계속하기"
              color="구글"
              route="/icon/google.svg"
            />
            {/* 카카오, 네이버 주석 유지 */}
          </div>

          {/* 하단 모드 전환 섹션 */}
          <div className="flex gap-[6px] text-[14px]">
            <span className={isLoginMode ? "text-[#999]" : "text-[#828282]"}>
              {isLoginMode
                ? "아직 VERITRIP 회원이 아니신가요?"
                : "이미 VERITRIP 회원이신가요?"}
            </span>
            <p
              className={`font-bold cursor-pointer hover:underline ${
                isLoginMode ? "text-[#5E0E8C]" : "text-white"
              }`}
              onClick={() => setIsLoginMode(!isLoginMode)}
            >
              {isLoginMode ? "회원가입" : "로그인"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
