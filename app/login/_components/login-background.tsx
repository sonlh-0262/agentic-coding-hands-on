export function LoginBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Layer 0: dark base fallback */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: "#00101A" }}
        aria-hidden="true"
      />

      {/* Layer 1: Key visual artwork (C.mms_C_Keyvisual). The gradient
          overlays below mask the left so foreground content reads cleanly
          while the organic artwork shows through on the right. */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/login/bg-keyvisual.jpg')" }}
        aria-hidden="true"
      />

      {/* Layer 2: Vertical gradient overlay — covers bottom two-thirds */}
      <div
        className="absolute left-0 w-full"
        style={{
          top: "138px",
          height: "1093px",
          background:
            "linear-gradient(0deg, #00101A 22.48%, rgba(0, 19, 32, 0.00) 51.74%)",
        }}
        aria-hidden="true"
      />

      {/* Layer 3: Horizontal gradient overlay — left-to-right fade.
          Solid stop widened from the design's 25.41% to 46% to fully mask the
          baked-in foreground text in bg-keyvisual.jpg (no clean artwork-only
          asset exists in Figma), while still revealing the artwork on the
          right. Real foreground content renders over this solid-dark zone. */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            "linear-gradient(90deg, #00101A 0%, #00101A 46%, rgba(0, 16, 26, 0.00) 92%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

export default LoginBackground;
