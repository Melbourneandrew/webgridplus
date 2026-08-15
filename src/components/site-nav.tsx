"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  reloadDocument?: boolean;
  activePaths?: string[];
};

export function SiteNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-5">
      {items.map(({ href, label, reloadDocument, activePaths }) => {
        const paths = activePaths ?? [href];
        const isActive = paths.some(
          (path) => pathname === path || (path !== "/" && pathname.startsWith(`${path}/`)),
        );

        const props = {
          "aria-current": isActive ? ("page" as const) : undefined,
          className: `border-b-2 py-1 text-sm transition-colors hover:no-underline ${
            isActive
              ? "border-black font-semibold text-black"
              : "border-transparent text-black/60 hover:text-black"
          }`,
        };

        if (reloadDocument) {
          return <a key={href} href={href} {...props}>{label}</a>;
        }

        return (
          <Link
            key={href}
            href={href}
            {...props}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
