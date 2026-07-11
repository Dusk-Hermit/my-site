import type { Metadata } from "next";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "My Lab",
  description: "A personal lab site",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-accent)] font-sans transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          <main className="mx-auto max-w-4xl px-4 pt-16 pb-12">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
