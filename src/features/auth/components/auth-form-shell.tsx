import Link from "next/link";
import type { ReactNode } from "react";

export const authInputClassName =
  "border border-black/20 bg-white px-3.5 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10";

export const authSubmitClassName =
  "mt-1 border border-black bg-black px-4 py-3 font-semibold text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50";

type AuthFormShellProps = {
  activeTab: "login" | "signup";
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthFormShell({ activeTab, title, subtitle, children }: AuthFormShellProps) {
  const tabs = [
    { id: "login", href: "/login", label: "Log in" },
    { id: "signup", href: "/signup", label: "Sign up" },
  ] as const;

  return (
    <section className="mx-auto mt-8 w-full max-w-md border border-black/15 bg-white">
      <nav className="grid grid-cols-2 border-b border-black/15" aria-label="Account access">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`border-b-2 px-4 py-3 text-center text-sm transition-colors hover:no-underline ${
                isActive
                  ? "border-black font-semibold text-black"
                  : "border-transparent text-black/50 hover:text-black"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-black/55">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
