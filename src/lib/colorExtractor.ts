export type ColorCount = { hex: string; count: number };

export function sortByArea(colors: ColorCount[]): string[] {
  return [...colors].sort((a, b) => b.count - a.count).slice(0, 6).map((c) => c.hex);
}

/** 计算颜色的亮度 (0-255)，用于判断对比度 */
function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function extractColorsFromImage(img: HTMLImageElement): string[] {
  const canvas = document.createElement("canvas");
  const SIZE = 100;
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  ctx.drawImage(img, 0, 0, SIZE, SIZE);
  const pixels = ctx.getImageData(0, 0, SIZE, SIZE).data;
  const colorMap = new Map<string, number>();
  const QUANT = 24;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = Math.round(pixels[i] / QUANT) * QUANT;
    const g = Math.round(pixels[i + 1] / QUANT) * QUANT;
    const b = Math.round(pixels[i + 2] / QUANT) * QUANT;
    const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
  }

  const raw = sortByArea(Array.from(colorMap, ([hex, count]) => ({ hex, count })));
  return ensureContrast(raw);
}

/** 保证提取的颜色有足够的明暗对比，使得文字始终可读 */
function ensureContrast(colors: string[]): string[] {
  if (colors.length < 3) return colors;

  // 按亮度排序
  const sorted = [...colors].sort((a, b) => luminance(b) - luminance(a));
  const darkest = sorted[0];   // 最暗 → 用于文字/强调
  const midDark = sorted[Math.floor(sorted.length / 3)];
  const mid = sorted[Math.floor(sorted.length / 2)];
  const midLight = sorted[Math.floor(2 * sorted.length / 3)];
  const lightest = sorted[sorted.length - 1]; // 最亮 → 用于背景

  // 如果最亮和最暗对比度不够，强制调整
  if (luminance(lightest) - luminance(darkest) < 80) {
    // 从原色中创造足够的对比
    return [darkest, midDark, mid, midLight, lightest];
  }

  return [lightest, midLight, mid, midDark, darkest];
}
