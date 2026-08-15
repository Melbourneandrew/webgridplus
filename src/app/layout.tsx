import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { getCurrentUser } from "@/services/auth/session";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Webgrid+",
    template: "%s | Webgrid+",
  },
  description: "Test and improve your point-and-click speed.",
  icons: {
    icon: [
      {
        url: "/wgp-favicon.png?v=2",
        type: "image/png",
        sizes: "64x64",
      },
    ],
    shortcut: "/wgp-favicon.png?v=2",
  },
};

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
              <Link href="/" className="text-2xl font-bold hover:no-underline">
                Webgrid+
              </Link>
              <div className="flex items-center gap-5">
                <SiteNav
                  items={[
                    { href: "/play", label: "Play", activePaths: ["/", "/play"] },
                    { href: "/leaderboard", label: "Leaderboard", reloadDocument: true },
                    ...(user
                      ? [{ href: `/profile/${user.id}`, label: "Profile" }]
                      : [{ href: "/login", label: "Log in" }]),
                  ]}
                />
                {user ? <LogoutButton /> : null}
              </div>
            </nav>
          </header>
          <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
