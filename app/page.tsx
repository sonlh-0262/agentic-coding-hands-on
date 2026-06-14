import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";

// Auth state is per-request; never serve a cached/prerendered redirect.
export const dynamic = "force-dynamic";

/**
 * Protected home (post-login landing). Authoritative auth check; the proxy
 * also redirects unauthenticated users to /login optimistically.
 */
export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const name =
    (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "bạn";

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-[#00101A] px-6 text-center text-white">
      <h1 className="text-3xl font-bold sm:text-4xl">Chào mừng, {name}!</h1>
      <p className="text-white/70">Bạn đã đăng nhập vào SAA 2025.</p>
      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="rounded-lg bg-[rgba(255,234,158,1)] px-6 py-3 font-bold text-[#00101A] transition-all hover:shadow-lg hover:brightness-105"
        >
          Đăng xuất
        </button>
      </form>
    </main>
  );
}
