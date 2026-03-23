"use client";

import type { CSSProperties, Key, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { adminTw } from "./styles";

type AdminTableAlign = "left" | "center" | "right";

export interface AdminTableColumn {
  key: string;
  header: ReactNode;
  width?: CSSProperties["width"];
  align?: AdminTableAlign;
  className?: string;
  headerClassName?: string;
}

interface AdminDataTableProps<T> {
  columns: AdminTableColumn[];
  rows: T[];
  getRowKey: (row: T, index: number) => Key;
  renderRowCells: (row: T, index: number) => ReactNode;
  rowClassName?: (row: T, index: number) => string | undefined;
  onRowClick?: (row: T, index: number) => void;
  emptyContent?: ReactNode;
  wrapperClassName?: string;
  tableClassName?: string;
}

const alignClassName: Record<AdminTableAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export default function AdminDataTable<T>({
  columns,
  rows,
  getRowKey,
  renderRowCells,
  rowClassName,
  onRowClick,
  emptyContent,
  wrapperClassName,
  tableClassName,
}: AdminDataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto", wrapperClassName)}>
      <table className={cn("min-w-full text-sm", tableClassName)}>
        <thead className="bg-muted/40">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  adminTw.tableHeadCell,
                  alignClassName[column.align ?? "left"],
                  column.headerClassName,
                )}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={adminTw.emptyCell}>
                {emptyContent ?? "데이터가 없습니다."}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                className={cn(
                  adminTw.tableRow,
                  onRowClick && "cursor-pointer",
                  rowClassName?.(row, index),
                )}
                onClick={onRowClick ? () => onRowClick(row, index) : undefined}
              >
                {renderRowCells(row, index)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
