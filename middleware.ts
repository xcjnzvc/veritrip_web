import { NextRequest, NextResponse } from "next/server";

interface JwtPayload {
  sub?: number;
  role?: string;
  exp?: number;
}

const ACCESS_TOKEN_COOKIE_CANDIDATES = ["accessToken", "access_token", "token", "authToken"];

const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const [, payload = ""] = token.split(".");
    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const json = atob(padded);

    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
};

const getAccessTokenFromCookies = (request: NextRequest): string | null => {
  for (const key of ACCESS_TOKEN_COOKIE_CANDIDATES) {
    const token = request.cookies.get(key)?.value;
    if (token) {
      return token.startsWith("Bearer ") ? token.slice(7) : token;
    }
  }

  return null;
};

export function middleware(request: NextRequest) {
  const token = getAccessTokenFromCookies(request);
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isExpired = typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
  if (isExpired) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (payload.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
