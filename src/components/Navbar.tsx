"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "首页" },
  { href: "/articles", label: "文章" },
  { href: "/games", label: "小游戏" },
  { href: "/color-analyzer", label: "🎨色彩分析器" },
  { href: "/about", label: "关于" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-[var(--color-secondary)]/40 bg-[var(--color-primary)]/85 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-wide text-[var(--color-accent)]">
          My Lab
        </Link>
        <div className="hidden gap-6 sm:flex">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors ${
                pathname === href ? "font-semibold text-[var(--color-accent)]" : "text-[var(--color-accent)]/50"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        <button className="sm:hidden text-[var(--color-accent)]" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-2 border-t border-[var(--color-secondary)]/40 px-4 py-3 sm:hidden bg-[var(--color-primary)]/95 backdrop-blur-md">
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm text-[var(--color-accent)]" onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
