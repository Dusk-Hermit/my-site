import { describe, it, expect } from "vitest";
import { sortByArea } from "@/lib/colorExtractor";

describe("sortByArea", () => {
  it("returns top 3 colors sorted by pixel count descending", () => {
    expect(sortByArea([{hex:"#aaa",count:100},{hex:"#fff",count:500},{hex:"#000",count:300},{hex:"#f00",count:50}])).toEqual(["#fff","#000","#aaa"]);
  });
  it("returns fewer if less than 3 colors", () => {
    expect(sortByArea([{hex:"#fff",count:500},{hex:"#000",count:300}])).toEqual(["#fff","#000"]);
  });
});
