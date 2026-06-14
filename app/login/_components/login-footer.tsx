export function LoginFooter() {
  return (
    <footer
      className="absolute left-0 w-full flex items-center justify-center"
      style={{
        top: "933px",
        height: "91px",
        padding: "40px 90px",
        borderTop: "1px solid #2E3940",
      }}
      aria-label="Page footer"
    >
      <p
        className="text-white text-center"
        style={{
          fontFamily: "var(--font-montserrat-alt), sans-serif",
          fontWeight: 700,
          fontSize: "16px",
          lineHeight: "24px",
        }}
      >
        Bản quyền thuộc về Sun* © 2025
      </p>
    </footer>
  );
}

export default LoginFooter;
