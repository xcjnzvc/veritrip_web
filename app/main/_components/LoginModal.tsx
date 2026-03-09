"use client";

import { useState } from "react";
import Image from "next/image";
import LoginInput from "./LoginInput";
import Button from "./Button";
import Divider from "./Divider";
import Checkbox from "./Checkbox";
import { loginUser, userInfo } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const { setLogin, setUserInfo } = useAuthStore();
  const router = useRouter();

  // 체크박스 상태 관리
  const [isRemember, setIsRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await loginUser(email, password);

      if (result.code === 200) {
        // 1. 일단 토큰부터 저장! (헤더에 토큰을 실기 위함)
        setLogin(result.data.accessToken);

        // 2. 이제 헤더에 토큰이 있으니 안심하고 유저 정보 호출
        const userRes = await userInfo();

        console.log("userRes", userRes);

        // 3. 이미 저장된 토큰은 건드리지 않고, 유저 정보만 스토어에 추가 저장
        setUserInfo(userRes.data);

        toast.success("로그인이 완료되었습니다!");
        router.push("/main");
        onClose();
      }
    } catch (error) {
      toast.error("로그인 정보를 확인해주세요.");
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
        className="relative bg-white pt-[66px] pb-[30px] px-[50px] max-w-[500px] w-full flex flex-col items-center rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <Image
          src="/icon/cancel.svg"
          alt="cancel"
          width={20}
          height={20}
          className="absolute top-[20px] right-[20px] cursor-pointer"
          onClick={onClose}
        />

        <div className="flex flex-col gap-[30px] w-full items-center">
          {/* 헤더 로고 섹션 */}
          <div className="text-center">
            <h2 className="text-[26px] text-[#5E0E8C] font-bold">VERITRIP</h2>
            <p className="text-[14px] text-[#999]">
              지금 바로 VERITRIP의 특별한 여정에 합류하세요.
            </p>
          </div>

          {/* 입력 및 로그인 섹션 */}
          <div className="flex flex-col gap-[14px] w-full">
            <LoginInput
              placeholder="아이디"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <LoginInput
              placeholder="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              text={isLoading ? "연결 중..." : "로그인"}
              color="로그인"
              onClick={handleLogin}
              disabled={isLoading}
            />

            <div className="flex justify-between items-center px-1">
              {/* 아이디 저장 체크박스 */}
              <Checkbox
                label="아이디 저장"
                checked={isRemember}
                onChange={() => setIsRemember(!isRemember)}
              />

              <p className="text-[14px] text-[#999] cursor-pointer hover:underline">
                비밀번호 찾기
              </p>
            </div>
          </div>

          <Divider />

          {/* 소셜 로그인 섹션 */}
          <div className="flex flex-col gap-[10px] w-full">
            <Button text="구글" color="구글" route="/icon/google.svg" />
            <Button text="카카오" color="카카오" route="/icon/kakao.svg" />
            <Button text="네이버" color="네이버" route="/icon/naver.svg" />
          </div>

          <div className="flex gap-[6px] text-[14px]">
            <span className="text-[#999]">
              아직 VERITRIP 회원이 아니신가요?
            </span>
            <p className="text-[#5E0E8C] font-bold">회원가입</p>
          </div>
        </div>
      </div>
    </div>
  );
}
