import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/components/ThemeProvider";

describe("ThemeProvider", () => {
  it("sets default zinc CSS variables on the document root", () => {
    render(
      <ThemeProvider>
        <div data-testid="child">test</div>
      </ThemeProvider>
    );
    expect(screen.getByTestId("child")).toBeDefined();
    const root = document.documentElement;
    expect(root.style.getPropertyValue("--color-primary")).toBe("#fafafa");
    expect(root.style.getPropertyValue("--color-secondary")).toBe("#e4e4e7");
    expect(root.style.getPropertyValue("--color-accent")).toBe("#18181b");
    expect(root.style.getPropertyValue("--color-bg")).toBe("#fafafa");
  });
});
