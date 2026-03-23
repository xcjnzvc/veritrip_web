import { ACCESS_TOKEN_COOKIE_CANDIDATES } from "@/lib/constants/accessTokenCookie";
import { NextRequest, NextResponse } from "next/server";

interface JwtPayload {
  sub?: number;
  role?: string;
  exp?: number;
}

const ACCESS_TOKEN_REFRESH_LEEWAY_MS = 5 * 60 * 1000;

const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const [, payload = ""] = token.split(".");
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
};

const getAccessTokenFromCookies = (request: NextRequest): string | null => {
  for (const key of ACCESS_TOKEN_COOKIE_CANDIDATES) {
    const token = request.cookies.get(key)?.value;
    if (token) return token.startsWith("Bearer ") ? token.slice(7) : token;
  }
  return null;
};

const shouldRefreshToken = (payload: JwtPayload | null): boolean => {
  if (!payload || typeof payload.exp !== "number") return true;
  const expireAtMs = payload.exp * 1000;
  return expireAtMs - Date.now() <= ACCESS_TOKEN_REFRESH_LEEWAY_MS;
};

const extractAccessTokenFromRefreshResponse = (body: unknown): string | null => {
  if (!body || typeof body !== "object") return null;
  const candidate = body as {
    data?: { accessToken?: string; data?: { accessToken?: string } };
  };

  const token = candidate.data?.accessToken ?? candidate.data?.data?.accessToken;
  return typeof token === "string" && token.length > 0 ? token : null;
};

const refreshAccessToken = async (request: NextRequest): Promise<string | null> => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBase) return null;

  try {
    const refreshResponse = await fetch(`${apiBase}/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: request.headers.get("cookie") ?? "",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!refreshResponse.ok) return null;

    const body = (await refreshResponse.json()) as unknown;
    return extractAccessTokenFromRefreshResponse(body);
  } catch {
    return null;
  }
};

export async function proxy(request: NextRequest) {
  let token = getAccessTokenFromCookies(request);
  let payload = token ? decodeJwtPayload(token) : null;

  // access token이 없거나 만료 임박(5분 이내)일 때만 refresh 요청
  if (!token || shouldRefreshToken(payload)) {
    const refreshedToken = await refreshAccessToken(request);
    if (refreshedToken) {
      token = refreshedToken;
      payload = decodeJwtPayload(refreshedToken);
    } else if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (!token || !payload) return NextResponse.redirect(new URL("/", request.url));

  if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (payload.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("authorization", `Bearer ${token}`);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 브라우저 쿠키를 갱신해 다음 요청부터 최신 access token 사용
  response.cookies.set("accessToken", token, {
    httpOnly: false,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/",
  });

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/((?!_next|api).*)"],
};
