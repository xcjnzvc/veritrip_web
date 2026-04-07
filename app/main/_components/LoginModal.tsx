"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LoginInput from "./LoginInput";
import Button from "./Button";
import Divider from "./Divider";
import Checkbox from "./Checkbox";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import { loginUser, signin, userInfo, refreshSession } from "@/lib/api/auth";

interface ApiErrorResponse {
  code: number;
  message: string;
  data: null;
}

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const { setLogin, setUserInfo } = useAuthStore();
  const router = useRouter();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember, setIsRemember] = useState(false);

  /**
   * ✅ 로그인 / 회원가입 모드 바뀔 때 값 초기화
   */
  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
  }, [isLoginMode]);

  /**
   * ✅ 이메일 저장 (로그인 모드일 때만)
   */
  useEffect(() => {
    if (!isLoginMode) return;

    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setIsRemember(true);
    }
  }, [isLoginMode]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      const result = await loginUser(email, password);

      if (result.code === 200) {
        /**
         * 이메일 저장 처리
         */
        if (isRemember) {
          localStorage.setItem("savedEmail", email);
        } else {
          localStorage.removeItem("savedEmail");
        }

        /**
         * 세션 동기화
         */
        try {
          const session = await refreshSession();
          setLogin(session.accessToken);
          setUserInfo(session.user);
        } catch (e) {
          if (result?.data?.accessToken) {
            setLogin(result.data.accessToken);
          }

          try {
            const me = await userInfo();
            setUserInfo(me.data);
          } catch {}
        }

        toast.success("로그인이 완료되었습니다!");
        router.push("/main");
        onClose();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const serverMessage = error.response?.data.message;
        toast.error(serverMessage || "로그인에 실패했습니다.");
      } else {
        toast.error("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setIsLoading(true);

      const result = await signin(name, email, password);

      if (result.code === 200) {
        toast.success("회원가입이 완료되었습니다!");

        /**
         * ✅ 회원가입 후 상태 초기화 + 로그인 모드 전환
         */
        setName("");
        setEmail("");
        setPassword("");

        setIsLoginMode(true);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className={`relative flex w-full max-w-[500px] flex-col items-center rounded-2xl px-[50px] pt-[66px] pb-[30px] transition-colors duration-300 ${
          isLoginMode ? "bg-white" : "bg-[#1A1A1A]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <Image
          src="/icon/cancel.svg"
          alt="cancel"
          width={20}
          height={20}
          className={`absolute top-[20px] right-[20px] cursor-pointer ${
            !isLoginMode ? "brightness-200 invert" : ""
          }`}
          onClick={onClose}
        />

        <div className="flex w-full flex-col items-center gap-[30px]">
          {/* 헤더 */}
          <div className="text-center">
            <h2
              className={`text-[26px] font-bold ${isLoginMode ? "text-[#5E0E8C]" : "text-white"}`}
            >
              VERITRIP
            </h2>
            <p className={`text-[14px] ${isLoginMode ? "text-[#999]" : "text-[#828282]"}`}>
              지금 바로 VERITRIP의 특별한 여정에 합류하세요.
            </p>
          </div>

          {/* 입력 */}
          <div className="flex w-full flex-col gap-[14px]">
            {!isLoginMode && (
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
              text={isLoading ? "연결 중..." : isLoginMode ? "로그인" : "가입하기"}
              color="메인"
              onClick={isLoginMode ? handleLogin : handleSignUp}
              disabled={isLoading}
            />

            {/* 로그인 옵션 */}
            {isLoginMode && (
              <div className="flex items-center justify-between px-1">
                <Checkbox
                  label="이메일 저장"
                  checked={isRemember}
                  onChange={() => setIsRemember(!isRemember)}
                />
                <p className="cursor-pointer text-[14px] text-[#999] hover:underline">
                  비밀번호 찾기
                </p>
              </div>
            )}
          </div>

          <Divider />

          {/* 소셜 로그인 */}
          {/* <div className="flex w-full flex-col gap-[10px]">
            <Button text="Google로 계속하기" color="구글" route="/icon/google.svg" />
          </div> */}

          {/* 모드 전환 */}
          <div className="flex gap-[6px] text-[14px]">
            <span className={isLoginMode ? "text-[#999]" : "text-[#828282]"}>
              {isLoginMode ? "아직 VERITRIP 회원이 아니신가요?" : "이미 VERITRIP 회원이신가요?"}
            </span>
            <p
              className={`cursor-pointer font-bold hover:underline ${
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
