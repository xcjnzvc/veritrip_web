interface InputProps {
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function LoginInput({ placeholder, type = "text", value, onChange }: InputProps) {
  return (
    /* 1. focus-within:border-purple-500 -> 안쪽 input이 클릭되면 테두리 색 변경
        2. focus-within:ring-1 -> 살짝 두께감을 주고 싶을 때 추가 (선택사항)
      */
    <div className="0 w-full rounded-[10px] border border-[#ddd] bg-white px-[20px] py-[11px] transition-all focus-within:border-[#5E0E8C]">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        /* 3. focus:outline-none -> 클릭 시 나타나는 파란색 테두리 완전 제거 
            4. w-full -> input 영역을 전체로 넓혀서 어디를 눌러도 입력되게 함
          */
        className="w-full bg-transparent text-[14px] placeholder:text-[#999] focus:outline-none"
      />
    </div>
  );
}
