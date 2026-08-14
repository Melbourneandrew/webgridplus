"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
};

export function SiteNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-5">
      {items.map(({ href, label }) => {
        const isActive = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`border-b-2 py-1 text-sm transition-colors hover:no-underline ${
              isActive
                ? "border-black font-semibold text-black"
                : "border-transparent text-black/60 hover:text-black"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
