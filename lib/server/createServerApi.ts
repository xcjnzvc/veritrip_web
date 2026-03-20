"use server";

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type CreateServerApiOptions = {
  apiBase?: string;
  redirectTo?: string;
  retryOn401?: boolean;
};

type RefreshJsonShape = {
  data?: {
    accessToken?: string;
    data?: {
      accessToken?: string;
    };
  };
  accessToken?: string;
};

class CreateServerApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CreateServerApiError";
  }
}

function buildCookieHeader(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

function extractAccessTokenFromCookies(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  // 프로젝트에서 accessToken 쿠키명이 고정돼 있지 않을 수 있어 후보들을 모두 시도합니다.
  return (
    cookieStore.get("accessToken")?.value ??
    cookieStore.get("access_token")?.value ??
    cookieStore.get("Authorization")?.value ??
    null
  );
}

function normalizeAccessTokenForAuthorization(token: string) {
  // 토큰이 쿠키에 "Bearer ..." 형태로 들어있을 수도 있어 방어적으로 처리합니다.
  return token.startsWith("Bearer ") || token.startsWith("bearer ") ? token : `Bearer ${token}`;
}

function extractAccessTokenFromRefreshPayload(payload: unknown) {
  const data = payload as RefreshJsonShape;
  return data.data?.accessToken ?? data.data?.data?.accessToken ?? data.accessToken ?? null;
}

async function createAxiosWithAuthHeaders(
  cookieHeader: string,
  accessToken: string | null,
  apiBase: string,
) {
  const headers: Record<string, string> = {
    Cookie: cookieHeader,
    "Content-Type": "application/json",
  };

  if (accessToken) headers.Authorization = normalizeAccessTokenForAuthorization(accessToken);

  return axios.create({
    baseURL: apiBase,
    timeout: 60000,
    headers,
  });
}

async function createAxiosWithCookieOnly(cookieHeader: string, apiBase: string) {
  return axios.create({
    baseURL: apiBase,
    timeout: 60000,
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
  });
}

export async function createServerApi(options?: CreateServerApiOptions): Promise<AxiosInstance> {
  const { apiBase, redirectTo, retryOn401 = true } = options ?? {};
  const resolvedApiBase = apiBase ?? process.env.NEXT_PUBLIC_API_URL;
  if (!resolvedApiBase) {
    throw new CreateServerApiError("NEXT_PUBLIC_API_URL is not set.");
  }

  const cookieStore = await cookies();
  const cookieHeader = buildCookieHeader(cookieStore);
  const accessToken = extractAccessTokenFromCookies(cookieStore);

  // 원본 요청: Cookie + (가능하면) Authorization
  const api = await createAxiosWithAuthHeaders(cookieHeader, accessToken, resolvedApiBase);

  // refresh 요청: Authorization 없이 Cookie만 전송
  const refreshApi = await createAxiosWithCookieOnly(cookieHeader, resolvedApiBase);

  type RetriableAxiosRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

  if (retryOn401) {
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as RetriableAxiosRequestConfig | undefined;

        if (!originalRequest) return Promise.reject(error);

        const status = error.response?.status;

        const originalUrl = typeof originalRequest.url === "string" ? originalRequest.url : "";
        const isRefreshRequest = originalUrl.includes("/auth/refresh");

        // refresh 자체가 401이면 더 이상 시도하지 않습니다.
        if (status === 401 && isRefreshRequest) {
          if (redirectTo) redirect(redirectTo);
          return Promise.reject(error);
        }

        if (status !== 401) return Promise.reject(error);
        if (originalRequest._retry) return Promise.reject(error);
        originalRequest._retry = true;

        try {
          const refreshRes = await refreshApi.post("/auth/refresh");
          const newAccessToken = extractAccessTokenFromRefreshPayload(refreshRes.data);
          if (!newAccessToken)
            throw new CreateServerApiError("Refresh access token payload is empty.");

          // 실패했던 요청을 새 토큰으로 재시도
          const authorizationValue = normalizeAccessTokenForAuthorization(newAccessToken);
          const prevHeaders = originalRequest.headers;

          // AxiosHeaders(내부 타입)가 들어올 수 있으므로 `set()` 유무로 안전하게 주입합니다.
          const maybeAxiosHeaders = prevHeaders as
            | { set?: (name: string, value: string) => void }
            | undefined;
          if (maybeAxiosHeaders?.set) {
            maybeAxiosHeaders.set("Authorization", authorizationValue);
          } else {
            const headerRecord = (prevHeaders ?? {}) as Record<string, string>;
            headerRecord.Authorization = authorizationValue;
            (originalRequest.headers as Record<string, string>) = headerRecord;
          }
          return api.request(originalRequest as AxiosRequestConfig);
        } catch (e) {
          if (redirectTo) redirect(redirectTo);
          return Promise.reject(e);
        }
      },
    );
  }

  return api;
}
