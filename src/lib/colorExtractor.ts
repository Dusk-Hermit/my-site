export type ColorCount = { hex: string; count: number };

export function sortByArea(colors: ColorCount[]): string[] {
  return [...colors].sort((a, b) => b.count - a.count).slice(0, 3).map((c) => c.hex);
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
  const B = 16;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = Math.floor(pixels[i] / B) * B;
    const g = Math.floor(pixels[i + 1] / B) * B;
    const b = Math.floor(pixels[i + 2] / B) * B;
    const hex = `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
    colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
  }
  return sortByArea(Array.from(colorMap, ([hex, count]) => ({ hex, count })));
}
