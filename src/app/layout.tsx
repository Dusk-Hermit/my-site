import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "My Lab",
  description: "A personal lab site",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">{children}</body>
    </html>
  );
}
