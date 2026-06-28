import type { ReactNode } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/services/auth/session";
import "./globals.css";

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-white text-black">
          <header className="sticky top-0 z-10 border-b border-black/10 bg-white/90 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
              <Link href="/" className="text-2xl font-bold">
                Webgrid+
              </Link>
              <div className="flex gap-2">
                <Link href="/game">Play</Link>
                <Link href="/leaderboard">Leaderboard</Link>
                {user ? (
                  <>
                    <Link href={`/profile/${user.id}`}>Profile</Link>
                    <Link href="/auth/logout">Logout</Link>
                  </>
                ) : (
                  <>
                    <Link href="/signup">Signup</Link>
                    <Link href="/login">Login</Link>
                  </>
                )}
              </div>
            </nav>
          </header>
          <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
