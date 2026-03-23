"use server";

import type { AxiosError } from "axios";
import { createServerApi } from "./createServerApi";

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
): Promise<T> {
  const serverApi = await createServerApi({ apiBase });

  try {
    const method = init?.method ?? "GET";

    const normalizedHeaders = normalizeHeaders(init?.headers);

    const response = await serverApi.request<T>({
      url: path,
      method,
      data: init?.body,
      headers: normalizedHeaders,
    });

    return response.data;
  } catch (err: unknown) {
    if (!isAxiosError(err)) throw err;
    throw new AuthenticatedFetchError(`Request failed: ${err.response?.status ?? "unknown"}`);
  }
}
