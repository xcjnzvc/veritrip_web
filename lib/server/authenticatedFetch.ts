"use server";

import type { AxiosError } from "axios";
import { createServerApi } from "./createServerApi";

type AuthenticatedFetchOptions = {
  /**
   * 인증 실패(갱신 실패 포함) 시 이동할 경로.
   * - 설정되어 있으면 redirect()
   * - 설정되지 않으면 예외를 던집니다.
   */
  redirectTo?: string;
  /**
   * 401을 받았을 때 refresh+재시도를 수행할지 여부.
   * 기본값: true
   */
  retryOn401?: boolean;
};

class AuthenticatedFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticatedFetchError";
  }
}

function normalizeHeaders(
  headers: RequestInit["headers"] | undefined,
): Record<string, string> | undefined {
  if (!headers) return undefined;

  // `Headers` 인스턴스는 서버 런타임에도 존재하지만, browser 전용 여부에 덜 의존하도록
  // `forEach` 존재 여부로 판별합니다.
  if (typeof (headers as { forEach?: unknown }).forEach === "function") {
    const result: Record<string, string> = {};
    (headers as { forEach: (callbackfn: (value: string, key: string) => void) => void }).forEach(
      (value, key) => {
        result[key] = value;
      },
    );
    return result;
  }

  if (Array.isArray(headers)) {
    const result: Record<string, string> = {};
    for (const [key, value] of headers) {
      result[key] = value;
    }
    return result;
  }

  // Record<string, string>
  return headers as Record<string, string>;
}

function isAxiosError(err: unknown): err is AxiosError {
  if (typeof err !== "object" || err === null) return false;
  const maybe = err as { isAxiosError?: unknown };
  return maybe.isAxiosError === true;
}

export async function authenticatedFetch<T>(
  apiBase: string,
  path: string,
  init?: RequestInit,
  options?: AuthenticatedFetchOptions,
): Promise<T> {
  const { redirectTo, retryOn401 = true } = options ?? {};
  const serverApi = await createServerApi({
    apiBase,
    redirectTo,
    retryOn401,
  });

  try {
    const method = init?.method ?? "GET";

    const normalizedHeaders = normalizeHeaders(init?.headers);

    const response = await serverApi.request<T>({
      url: path,
      method,
      // fetch의 body는 axios의 data로 매핑합니다.
      data: init?.body,
      headers: normalizedHeaders,
    });

    return response.data;
  } catch (err: unknown) {
    if (!isAxiosError(err)) throw err;
    throw new AuthenticatedFetchError(`Request failed: ${err.response?.status ?? "unknown"}`);
  }
}
