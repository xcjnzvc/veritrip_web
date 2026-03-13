export default function LoadingSpinner({ text = "로딩 중..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#5E0E8C] border-t-transparent" />
      <p className="text-[14px] text-[#999]">{text}</p>
    </div>
  );
}
