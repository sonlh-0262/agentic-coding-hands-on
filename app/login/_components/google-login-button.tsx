"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export interface GoogleLoginButtonProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function GoogleLoginButton({
  onClick,
  loading = false,
  disabled = false,
}: GoogleLoginButtonProps) {
  const t = useTranslations("login");
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-label={t("googleLoginButton.ariaLabel")}
      className="
        flex flex-row items-center gap-2
        w-[305px] h-[60px] px-6 py-4 rounded-[8px]
        cursor-pointer transition-all duration-200
        hover:shadow-lg hover:brightness-105
        disabled:opacity-50 disabled:cursor-not-allowed
      "
      style={{ background: "rgba(255, 234, 158, 1)" }}
    >
      {/* Label */}
      <span
        className="text-[22px] font-bold leading-7 whitespace-nowrap"
        style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          color: "rgba(0, 16, 26, 1)",
        }}
      >
        {t("googleLoginButton.label")}{" "}
      </span>

      {/* Icon: spinner during loading, Google icon otherwise */}
      {loading ? (
        <span
          className="inline-block w-6 h-6 rounded-full border-2 border-[rgba(0,16,26,0.3)] border-t-[rgba(0,16,26,1)] animate-spin"
          aria-hidden="true"
        />
      ) : (
        <Image
          src="/login/Google.svg"
          alt="Google"
          width={24}
          height={24}
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export default GoogleLoginButton;
