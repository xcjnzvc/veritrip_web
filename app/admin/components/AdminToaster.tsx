"use client";

import { Toaster } from "sonner";

export default function AdminToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast: "font-sans text-sm",
          title: "font-semibold",
          description: "text-xs opacity-80",
        },
      }}
    />
  );
}
