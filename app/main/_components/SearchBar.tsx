import Image from "next/image";

export default function SearchBar() {
  return (
    <div className="flex w-full max-w-[720px] items-center gap-[14px] rounded-full border border-[#e2e2e2] bg-[#f9f9f9] px-[20px] py-[14px] shadow-[1px_2px_10px_0px_rgba(0,0,0,0.10)]">
      <Image src="icon/add-plus.svg" alt="plusIcon" width={24} height={24} />
      <input
        className="flex-1 bg-transparent outline-none placeholder:text-base placeholder:font-normal placeholder:text-[#666666]"
        placeholder="VERITRIP와 계획해 보세요"
      />
    </div>
  );
}
