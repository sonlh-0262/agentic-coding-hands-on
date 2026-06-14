import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import LoginClient from "./_components/login-client";

export const metadata: Metadata = {
  title: "Đăng nhập | SAA 2025",
  description: "Đăng nhập để bắt đầu hành trình cùng SAA 2025.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // Authoritative auth check (proxy also redirects optimistically).
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  const { error } = await searchParams;

  return <LoginClient initialError={error === "auth"} />;
}
