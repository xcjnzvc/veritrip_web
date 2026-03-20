"use client";

import type { ReactNode } from "react";
import { adminTw } from "./styles";

interface AdminPageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
}

export default function AdminPageHeader({ title, subtitle }: AdminPageHeaderProps) {
  return (
    <div className={adminTw.headerBlock}>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {subtitle ? <p className={adminTw.subtitle}>{subtitle}</p> : null}
    </div>
  );
}

