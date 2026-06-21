import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import LoginClient from "./_components/login-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("login.title"),
    description: t("login.description"),
  };
}

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
