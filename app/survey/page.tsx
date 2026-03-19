"use client";

import { Suspense } from "react";
import Survey from "./Survey"; // 기존 코드를 Survey.tsx로 이름 바꾸고

export default function SurveyPage() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <Survey />
    </Suspense>
  );
}
