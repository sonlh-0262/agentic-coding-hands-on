import Image from "next/image";

/**
 * AwardsHero — Full-width keyvisual banner for the Award System page.
 * Contains the "ROOT FURTHER" artwork background, subtitle, and main gold title.
 * No countdown — purely decorative.
 */
export default function AwardsHero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "454px" }}
      aria-labelledby="awards-hero-title"
    >
      {/* Full-width keyvisual background — meaningful image, alt per spec */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/awards/keyvisual-bg.png"
          alt="Keyvisual Sun* Annual Award 2025"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0, 16, 26, 0.4)" }}
        aria-hidden="true"
      />

      {/* Content centered */}
      <div
        className="relative z-10 flex flex-col"
        style={{
          padding: "0 144px",
          paddingTop: "325px",
          gap: "16px",
        }}
      >
        {/* Subtitle */}
        <p
          className="font-bold text-white"
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "24px",
            lineHeight: "32px",
            letterSpacing: "0px",
            margin: 0,
          }}
        >
          Sun* Annual Awards 2025
        </p>

        {/* Horizontal rule */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(46, 57, 64, 1)",
            margin: 0,
          }}
          aria-hidden="true"
        />

        {/* Main title */}
        <h1
          id="awards-hero-title"
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "57px",
            fontWeight: 700,
            lineHeight: "64px",
            letterSpacing: "-0.25px",
            color: "rgba(255, 234, 158, 1)",
            margin: 0,
          }}
        >
          Hệ thống giải thưởng SAA 2025
        </h1>
      </div>
    </section>
  );
}
