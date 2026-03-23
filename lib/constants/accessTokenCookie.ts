/**
 * 액세스 토큰이 들어갈 수 있는 쿠키 이름 후보.
 * - 클라이언트: zustand + (선택) 동일 이름 쿠키
 * - 서버 API 프록시: `Cookie`로 httpOnly까지 전달 + 아래 이름이 있으면 `Authorization` 보강
 */
export const ACCESS_TOKEN_COOKIE_CANDIDATES = [
  "accessToken",
  "access_token",
  "token",
  "authToken",
  "Authorization",
] as const;
