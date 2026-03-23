"use client";

import { QUERY_CLIENT_DEFAULT_OPTIONS } from "@/lib/react-query/queryClientDefaults";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useState } from "react";

export default function QueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: QUERY_CLIENT_DEFAULT_OPTIONS }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
