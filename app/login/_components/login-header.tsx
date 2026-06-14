import Image from "next/image";
import Link from "next/link";

export interface LanguageSwitcherProps {
  onClick?: () => void;
}

export interface LoginHeaderProps {
  onLanguageClick?: () => void;
}

export function LanguageSwitcher({ onClick }: LanguageSwitcherProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex items-center justify-between gap-0.5
        w-[108px] h-14 px-4 rounded-[4px] cursor-pointer
        transition-[background-color] duration-200 ease-[ease]
        hover:bg-white/[0.08]
      "
      aria-label="Switch language"
    >
      {/* Left: flag + label */}
      <span className="flex items-center gap-1">
        <Image
          src="/login/VN.svg"
          alt="Vietnamese flag"
          width={24}
          height={24}
        />
        <span
          className="text-white text-base font-bold leading-6 tracking-[0.15px]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          VN
        </span>
      </span>

      {/* Right: chevron */}
      <Image
        src="/login/Down.svg"
        alt="Expand"
        width={24}
        height={24}
      />
    </button>
  );
}

export default function LoginHeader({ onLanguageClick }: LoginHeaderProps) {
  return (
    <header
      className="absolute top-0 left-0 w-full z-[1] flex flex-row items-center justify-between"
      style={{
        height: "80px",
        padding: "12px 144px",
        background: "rgba(11, 15, 18, 0.80)",
      }}
    >
      {/* Logo */}
      <Link href="/" aria-label="Go to homepage" className="flex items-center">
        <div className="w-[52px] h-14 flex items-center justify-center">
          <Image
            src="/login/Logo.png"
            alt="SAA 2025 logo"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
      </Link>

      {/* Language switcher */}
      <div className="w-[108px] h-14 flex items-center justify-center">
        <LanguageSwitcher onClick={onLanguageClick} />
      </div>
    </header>
  );
}
