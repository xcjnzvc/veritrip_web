import Image from "next/image";

interface SearchBarProps {
  onClick?: () => void;
  readOnly?: boolean;
}

export default function SearchBar({ onClick, readOnly }: SearchBarProps) {
  return (
    <div
      className="flex w-full max-w-[720px] cursor-pointer items-center gap-[14px] rounded-full border border-[#e2e2e2] bg-[#f9f9f9] px-[20px] py-[14px] shadow-[1px_2px_10px_0px_rgba(0,0,0,0.10)]"
      onClick={onClick} // 2. 검색창 영역 어디를 눌러도 모달이 뜨게 div에 걸어주는 것이 좋습니다.
    >
      <Image src="/icon/add-plus.svg" alt="plusIcon" width={24} height={24} />
      <input
        className="flex-1 cursor-pointer bg-transparent outline-none placeholder:text-base placeholder:font-normal placeholder:text-[#666666]"
        placeholder="VERITRIP와 계획해 보세요"
        readOnly={readOnly} // 3. 로그인 안했을 때 타이핑을 막으려면 필요합니다.
        // input 자체의 클릭 이벤트가 div로 전파되므로 여기는 따로 안 적어도 됩니다.
      />
    </div>
  );
}
