// UserInfoBox.tsx 내부
export default function UserInfoBox({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 top-10 mt-2 border-2 border-red-500 bg-white p-4 rounded-lg shadow-lg z-50 w-[200px]">
      <p>유저정보</p>
      <button onClick={onClose}>닫기</button>
    </div>
  );
}
