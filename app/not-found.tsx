import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div
      className={cn("flex min-h-screen flex-col items-center justify-center", "bg-gray-50 px-4")}
    >
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-blue-600">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          페이지를 찾을 수 없어요
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          요청하신 페이지가 존재하지 않거나, 이동되었을 수 있어요.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className={cn(
              "inline-flex items-center justify-center rounded-md",
              "bg-blue-600 px-4 py-2 text-sm font-medium text-white",
              "hover:bg-blue-700",
              "transition-colors",
            )}
          >
            메인으로 돌아가기
          </Link>
          <Link
            href="/main"
            className={cn(
              "text-sm font-medium text-gray-700 underline-offset-4",
              "hover:underline",
            )}
          >
            여행 메인 페이지 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
