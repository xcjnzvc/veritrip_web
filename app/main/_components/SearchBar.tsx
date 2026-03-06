import Image from "next/image";

export default function SearchBar() {
  return (
    <div className="bg-[#f9f9f9] flex items-center gap-[14px] rounded-full border border-[#e2e2e2] px-[20px] py-[14px] max-w-[720px] w-full shadow-[1px_2px_10px_0px_rgba(0,0,0,0.10)]">
      <Image src="icon/add-plus.svg" alt="plusIcon" width={24} height={24} />
      <input
        className="flex-1 bg-transparent outline-none placeholder:text-[#666666] placeholder:text-base placeholder:font-normal"
        placeholder="VERITRIP와 계획해 보세요"
      />
    </div>
  );
}
