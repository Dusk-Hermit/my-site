import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "@/components/Navbar";

describe("Navbar", () => {
  it("renders all five navigation links", () => {
    render(<Navbar />);
    expect(screen.getByText("首页")).toBeDefined();
    expect(screen.getByText("文章")).toBeDefined();
    expect(screen.getByText("小游戏")).toBeDefined();
    expect(screen.getByText("🎨色彩分析器")).toBeDefined();
    expect(screen.getByText("关于")).toBeDefined();
  });
});
