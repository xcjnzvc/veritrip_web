import { ACCESS_TOKEN_COOKIE_CANDIDATES } from "@/lib/constants/accessTokenCookie";

/** `next/headers`의 `cookies()` 반환값과 호환 */
export type RequestCookieStore = {
  getAll: () => Array<{ name: string; value: string }>;
  get: (name: string) => { value: string } | undefined;
};

export function buildCookieHeader(cookieStore: RequestCookieStore): string {
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

export function extractAccessTokenFromCookies(cookieStore: RequestCookieStore): string | null {
  for (const name of ACCESS_TOKEN_COOKIE_CANDIDATES) {
    const value = cookieStore.get(name)?.value;
    if (value) return value;
  }
  return null;
}

export function normalizeAccessTokenForAuthorization(token: string): string {
  return token.startsWith("Bearer ") || token.startsWith("bearer ") ? token : `Bearer ${token}`;
}
