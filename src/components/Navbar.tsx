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
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-200/50 bg-[var(--color-primary)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-wide">
          My Lab
        </Link>
        <div className="hidden gap-6 sm:flex">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors hover:text-[var(--color-accent)] ${
                pathname === href ? "font-semibold text-[var(--color-accent)]" : "text-zinc-500"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        <button className="sm:hidden text-zinc-600" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-2 border-t border-zinc-200/50 px-4 py-3 sm:hidden bg-[var(--color-primary)]/95 backdrop-blur-md">
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm" onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
