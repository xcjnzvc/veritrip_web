import type { DefaultOptions } from "@tanstack/react-query";

/** 클라이언트 QueryProvider 기본값. retry 과다 시 실패까지 대기 시간이 길어집니다. */
export const QUERY_CLIENT_DEFAULT_OPTIONS: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5,
    retry: 0,
    refetchOnWindowFocus: false,
  },
};
