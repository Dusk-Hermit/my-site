import { describe, it, expect } from "vitest";
import { sortByArea } from "@/lib/colorExtractor";

describe("sortByArea", () => {
  it("returns top colors sorted by pixel count descending", () => {
    expect(sortByArea([{hex:"#aaa",count:100},{hex:"#fff",count:500},{hex:"#000",count:300},{hex:"#f00",count:50},{hex:"#0f0",count:200}])).toEqual(["#fff","#000","#0f0","#aaa","#f00"]);
  });
  it("returns up to 6 colors", () => {
    const items = Array.from({length:10},(_,i)=>({hex:`#${i}${i}${i}`,count:i}));
    expect(sortByArea(items).length).toBe(6);
  });
});
