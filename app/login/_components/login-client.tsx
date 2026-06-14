"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LoginBackground from "./login-background";
import LoginHeader from "./login-header";
import { HeroContent } from "./hero-content";
import LoginFooter from "./login-footer";

/**
 * Client wrapper for the Login screen. Composes the presentational
 * components and wires the Google OAuth sign-in flow + button state.
 */
export default function LoginClient({
  initialError,
}: {
  initialError?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError ?? false);

  async function handleLogin() {
    setError(false);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) {
        setError(true);
        setLoading(false);
      }
      // On success the browser is redirected to Google; keep `loading` true.
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#00101A]">
      <LoginBackground />
      <LoginHeader />
      <HeroContent
        onLoginClick={handleLogin}
        loginLoading={loading}
        loginDisabled={loading}
      />
      {error && (
        <p
          role="alert"
          className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded bg-red-500/90 px-4 py-2 text-sm text-white"
        >
          Đăng nhập thất bại. Vui lòng thử lại.
        </p>
      )}
      <LoginFooter />
    </main>
  );
}
