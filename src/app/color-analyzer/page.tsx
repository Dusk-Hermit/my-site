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
    if (saved) { setImageSrc(saved); const img = new Image(); img.onload = () => setColors(extractColorsFromImage(img)); img.src = saved; }
  }, []);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImageSrc(dataUrl);
      localStorage.setItem(IMAGE_STORAGE_KEY, dataUrl);
      const img = new Image();
      img.onload = () => setColors(extractColorsFromImage(img));
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (colors.length >= 3) applyTheme({ primary: colors[0], secondary: colors[1], accent: colors[2] });
    else if (colors.length === 2) applyTheme({ primary: colors[0], secondary: colors[1], accent: colors[1] });
    else if (colors.length === 1) applyTheme({ primary: colors[0], secondary: colors[0], accent: "#18181b" });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">🎨 色彩分析器</h1>
      <p className="mt-2 text-zinc-500">上传一张图片，提取主色调，按 60-30-10 比例应用到全站主题。</p>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center min-h-[200px]">
          {imageSrc ? <img src={imageSrc} alt="Uploaded" className="max-h-48 rounded-lg object-contain" /> : <><p className="text-zinc-400">拖拽或点击上传图片</p><p className="mt-1 text-xs text-zinc-300">PNG / JPG / WebP</p></>}
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="mt-4 text-sm" />
        </div>
        <div>
          <h2 className="font-semibold mb-3">提取的色调</h2>
          {colors.length > 0 ? (
            <div className="space-y-3">
              {colors.map((hex, i) => (
                <div key={hex} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg border border-zinc-200" style={{ backgroundColor: hex }} />
                  <div><code className="text-sm font-mono">{hex}</code><span className="ml-2 text-xs text-zinc-400">{i===0?"60% 主色":i===1?"30% 辅色":"10% 强调色"}</span></div>
                </div>
              ))}
              <div className="flex gap-3 pt-4">
                <button onClick={handleApply} className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition hover:opacity-80">应用主题</button>
                <button onClick={() => { setImageSrc(null); setColors([]); resetTheme(); localStorage.removeItem(IMAGE_STORAGE_KEY); }} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm transition hover:bg-zinc-100">重置</button>
              </div>
            </div>
          ) : <p className="text-sm text-zinc-400">上传图片后，主色调将显示在这里</p>}
        </div>
      </div>
    </div>
  );
}
