interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <div className="group flex cursor-pointer items-center gap-[8px]" onClick={onChange}>
      <div
        className={`flex h-[16px] w-[16px] items-center justify-center rounded-[4px] border transition-all ${checked ? "border-[#5E0E8C] bg-[#5E0E8C]" : "border-[#ddd] bg-white"} `}
      >
        {checked && (
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <p className="text-[14px] text-[#999] select-none group-hover:text-[#666]">{label}</p>
    </div>
  );
}
