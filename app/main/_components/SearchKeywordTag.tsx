import Image from "next/image";

interface Props {
  text: string;
}

export default function SearchKeywordTag({ text }: Props) {
  return (
    <div className="inline-flex cursor-pointer items-center gap-[6px] rounded-[12px] bg-[#F1E9F9] px-[12px] py-[12px] hover:bg-[#E8DBF4]">
      <Image src="/icon/sparkle.svg" alt="sparkle" width={14} height={14} />
      <span className="text-[14px] leading-none font-medium text-[#5D1B8E]">{text}</span>
    </div>
  );
}
