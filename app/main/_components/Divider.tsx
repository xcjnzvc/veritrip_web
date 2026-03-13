export default function Divider() {
  return (
    <div className="flex w-full items-center">
      {/* 왼쪽 선 */}
      <div className="flex-grow border-t border-[#eee]"></div>

      {/* 가운데 텍스트 */}
      <span className="px-4 text-[14px] font-medium text-[#bbb]">or</span>

      {/* 오른쪽 선 */}
      <div className="flex-grow border-t border-[#eee]"></div>
    </div>
  );
}
