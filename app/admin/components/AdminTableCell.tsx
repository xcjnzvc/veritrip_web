"use client";

import { cn } from "@/lib/utils";
import type { ReactNode, TdHTMLAttributes } from "react";
import { adminTw } from "./styles";

export type AdminTableCellType = "default" | "strong" | "mono" | "actionRight";

const ADMIN_TABLE_CELL_CLASS_MAP: Record<AdminTableCellType, string> = {
  default: adminTw.tableCell,
  strong: adminTw.tableCellStrong,
  mono: adminTw.tableCellMono,
  actionRight: `${adminTw.tableCell} text-right`,
};

type AdminTableCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  type?: AdminTableCellType;
  children: ReactNode;
};

export default function AdminTableCell({
  type = "default",
  className,
  children,
  ...rest
}: AdminTableCellProps) {
  return (
    <td className={cn(ADMIN_TABLE_CELL_CLASS_MAP[type], className)} {...rest}>
      {children}
    </td>
  );
}
