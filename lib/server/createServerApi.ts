"use server";

import {
  buildCookieHeader,
  extractAccessTokenFromCookies,
  normalizeAccessTokenForAuthorization,
} from "@/lib/utils/serverCookies";
import axios, { type AxiosInstance } from "axios";
import { cookies } from "next/headers";

type CreateServerApiOptions = {
  apiBase?: string;
};

class CreateServerApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CreateServerApiError";
  }
}

/**
 * 서버 → API 호출용 axios.
 * - 브라우저가 보낸 쿠키 전체를 `Cookie`로 전달(httpOnly 세션/토큰 포함)
 * - 읽기 가능한 액세스 토큰 쿠키가 있으면 `Authorization` 헤더 추가
 * - 401 시 refresh/재시도 없음(클라이언트 `axiosInstance`와 역할 분리)
 */
export async function createServerApi(options?: CreateServerApiOptions): Promise<AxiosInstance> {
  const { apiBase } = options ?? {};
  const resolvedApiBase = apiBase ?? process.env.NEXT_PUBLIC_API_URL;
  if (!resolvedApiBase) {
    throw new CreateServerApiError("NEXT_PUBLIC_API_URL is not set.");
  }

  const cookieStore = await cookies();
  const cookieHeader = buildCookieHeader(cookieStore);
  const accessToken = extractAccessTokenFromCookies(cookieStore);

  const headers: Record<string, string> = {
    Cookie: cookieHeader,
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers.Authorization = normalizeAccessTokenForAuthorization(accessToken);
  }

  return axios.create({
    baseURL: resolvedApiBase,
    timeout: 20_000,
    headers,
  });
}
