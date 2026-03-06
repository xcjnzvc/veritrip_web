import LoginModal from "@/app/main/_components/LoginModal";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="border-2 border-solid border-red-500 px-[40px] py-[8px] flex justify-between items-center">
      <div className="font-bold text-[16px] text-[#666666]">VERITRIP</div>
      <div className="flex items-center gap-[14px]">
        <Image
          src="/icon/mode-light.svg"
          alt="Mode Light Icon"
          width={24}
          height={24}
        />
        <button
          className="font-bold text-[14px] text-[#ffffff] bg-[#222222] px-[14px] py-[8px] rounded-[100px]"
          onClick={() => setIsModalOpen(true)}
        >
          LOGIN
        </button>
      </div>
      {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
