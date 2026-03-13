// UserInfoBox.tsx 내부
export default function UserInfoBox({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute top-10 right-0 z-50 mt-2 w-[200px] rounded-lg border-2 border-red-500 bg-white p-4 shadow-lg">
      <p>유저정보</p>
      <button onClick={onClose}>닫기</button>
    </div>
  );
}
