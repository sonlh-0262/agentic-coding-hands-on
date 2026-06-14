import Image from "next/image";
import { GoogleLoginButton } from "./google-login-button";

export interface HeroContentProps {
  onLoginClick?: () => void;
  loginLoading?: boolean;
  loginDisabled?: boolean;
}

export function HeroContent({
  onLoginClick,
  loginLoading = false,
  loginDisabled = false,
}: HeroContentProps) {
  return (
    /* Section container: mms_B_Bìa */
    <section
      className="absolute left-0 w-full flex flex-col"
      style={{
        top: "88px",
        width: "1440px",
        height: "845px",
        padding: "96px 144px",
        gap: "120px",
      }}
    >
      {/* Inner content frame: Frame 487 — 1152×653, flex col, gap 80px, justify center */}
      <div
        className="flex flex-col justify-center"
        style={{ width: "1152px", height: "653px", gap: "80px" }}
      >
        {/* Key visual: mms_B.1_Key Visual — Root Further logo */}
        <div style={{ width: "1152px", height: "200px" }}>
          <Image
            src="/login/Root_Further_Logo.png"
            alt="Root Further"
            width={451}
            height={200}
            style={{ objectFit: "cover", aspectRatio: "115 / 51" }}
            priority
          />
        </div>

        {/* Content + login frame: Frame 550 — 496×164, flex col, gap 24px, pl-4 */}
        <div
          className="flex flex-col"
          style={{ width: "496px", height: "164px", paddingLeft: "16px", gap: "24px" }}
        >
          {/* Welcome text: mms_B.2_content */}
          <p
            className="font-bold"
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "20px",
              lineHeight: "40px",
              letterSpacing: "0.5px",
              color: "rgba(255, 255, 255, 1)",
              width: "480px",
              margin: 0,
            }}
          >
            Bắt đầu hành trình của bạn cùng SAA 2025.
            <br />
            Đăng nhập để khám phá!
          </p>

          {/* Login button area: mms_B.3_Login */}
          <div style={{ width: "305px", height: "60px" }}>
            <GoogleLoginButton
              onClick={onLoginClick}
              loading={loginLoading}
              disabled={loginDisabled}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroContent;
