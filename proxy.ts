import { ACCESS_TOKEN_COOKIE_CANDIDATES } from "@/lib/constants/accessTokenCookie";
import { NextRequest, NextResponse } from "next/server";

interface JwtPayload {
  sub?: number;
  role?: string;
  exp?: number;
}

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

export function proxy(request: NextRequest) {
  // 1. 쿠키 확인 (가장 빠른 early return)
  const token = getAccessTokenFromCookies(request);
  if (!token) return NextResponse.redirect(new URL("/", request.url));

  // 2. JWT 디코딩 및 검증
  const payload = decodeJwtPayload(token);
  if (!payload) return NextResponse.redirect(new URL("/", request.url));

  if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (payload.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!_next|api).*)"],
};
