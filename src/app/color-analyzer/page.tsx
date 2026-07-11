"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { extractColorsFromImage } from "@/lib/colorExtractor";

const IMAGE_STORAGE_KEY = "my-site-uploaded-image";

export default function ColorAnalyzerPage() {
  const { applyTheme, resetTheme } = useTheme();
  const [colors, setColors] = useState<string[]>([]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(IMAGE_STORAGE_KEY);
    if (saved) { setImageSrc(saved); const img = new Image(); img.onload = () => { const e = extractColorsFromImage(img); setColors(e); autoApply(e); }; img.src = saved; }
  }, []);

  const autoApply = (extracted: string[]) => {
    if (extracted.length >= 5) {
      applyTheme({ primary: extracted[0], secondary: extracted[1], accent: extracted[4], surface: extracted[2], muted: extracted[3] });
    } else if (extracted.length >= 3) {
      applyTheme({ primary: extracted[0], secondary: extracted[1], accent: extracted[2], surface: extracted[1], muted: extracted[0] });
    } else if (extracted.length === 2) {
      applyTheme({ primary: extracted[0], secondary: extracted[1], accent: extracted[1], surface: extracted[0], muted: extracted[1] });
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImageSrc(dataUrl);
      localStorage.setItem(IMAGE_STORAGE_KEY, dataUrl);
      const img = new Image();
      img.onload = () => { const extracted = extractColorsFromImage(img); setColors(extracted); autoApply(extracted); };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const colorLabels = ["60% 主背景", "30% 辅色", "15% 表面色", "10% 柔和色", "5% 强调/文字"];

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--color-accent)]">🎨 色彩分析器</h1>
      <p className="mt-2 text-[var(--color-accent)]/50">上传一张图片，自动提取 5 种主色调，按黄金比例应用到全站。自动保证文字对比度。</p>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-secondary)]/40 bg-[var(--color-surface)]/20 p-8 text-center min-h-[220px]">
          {imageSrc ? <img src={imageSrc} alt="Uploaded" className="max-h-48 rounded-lg object-contain" /> : <><p className="text-[var(--color-accent)]/40">拖拽或点击上传图片</p><p className="mt-1 text-xs text-[var(--color-accent)]/30">PNG / JPG / WebP</p></>}
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="mt-4 text-sm text-[var(--color-accent)]" />
        </div>
        <div>
          <h2 className="font-semibold mb-3 text-[var(--color-accent)]">提取的色调（5 色）</h2>
          {colors.length > 0 ? (
            <div className="space-y-2.5">
              {colors.map((hex, i) => (
                <div key={hex} className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg border border-[var(--color-secondary)]/30 shadow-sm" style={{ backgroundColor: hex }} />
                  <div>
                    <code className="text-sm font-mono text-[var(--color-accent)]">{hex}</code>
                    <span className="ml-2 text-xs text-[var(--color-accent)]/40">{colorLabels[i] || ""}</span>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-4">
                <button onClick={() => autoApply(colors)} className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition hover:opacity-80">重新应用</button>
                <button onClick={() => { setImageSrc(null); setColors([]); resetTheme(); localStorage.removeItem(IMAGE_STORAGE_KEY); }} className="rounded-lg border border-[var(--color-secondary)] px-4 py-2 text-sm text-[var(--color-accent)] transition hover:bg-[var(--color-secondary)]/20">重置</button>
              </div>
            </div>
          ) : <p className="text-sm text-[var(--color-accent)]/40">上传图片后，主色调将显示在这里</p>}
        </div>
      </div>
    </div>
  );
}
