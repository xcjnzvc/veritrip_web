export const adminTw = {
  page: "mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6",
  headerBlock: "space-y-1",
  subtitle: "text-sm text-muted-foreground",
  rowBetween: "flex items-center justify-between",
  toolbar: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
  searchWrap: "relative w-full sm:max-w-sm",
  searchInput:
    "h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none ring-offset-background transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring",
  card: "rounded-xl border border-border bg-card shadow-sm",
  tableHeadCell: "px-4 py-3 text-left text-xs font-medium text-muted-foreground",
  tableRow: "border-t border-border hover:bg-muted/30",
  tableCell: "px-4 py-3 align-middle text-muted-foreground",
  tableCellStrong: "px-4 py-3 align-middle font-medium text-foreground",
  tableCellMono: "px-4 py-3 align-middle font-mono text-xs text-muted-foreground",
  emptyCell: "px-4 py-12 text-center text-muted-foreground",
  providerBadge: "rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground",
  dangerButton:
    "inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-500 disabled:opacity-60",
  paginationWrap: "flex items-center justify-between text-xs text-muted-foreground",
  iconButton:
    "inline-flex size-8 items-center justify-center rounded-md border border-border bg-background transition hover:bg-muted disabled:opacity-60",
  infoText: "text-sm text-muted-foreground",
  errorText: "text-sm text-red-400",
  infoCard: "rounded-md border border-border p-4 text-sm text-foreground",
  modalBackdrop: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-[2px]",
  modalCard: "w-full max-w-3xl rounded-xl border border-border bg-background p-6 shadow-xl",
} as const;

