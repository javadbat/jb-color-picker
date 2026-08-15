import { describe, expect, it } from "vitest";
import { colorToCss, convertColor, hsvToRgb, normalizeColor, rgbToHsv } from "./color.js";
import type { RGBColor } from "./types.js";

describe("color utilities", () => {
  it("normalizes RGB channels and alpha", () => {
    expect(normalizeColor({ colorSpace: "rgb", r: 260, g: -5, b: 10.6, alpha: 2 })).toEqual({
      colorSpace: "rgb",
      r: 255,
      g: 0,
      b: 11,
      alpha: 1,
    });
  });

  it("converts RGB to OKLCH and back while preserving alpha", () => {
    const original: RGBColor = { colorSpace: "rgb", r: 59, g: 102, b: 245, alpha: 0.42 };
    const oklch = convertColor(original, "oklch");
    expect(oklch.colorSpace).toBe("oklch");
    const converted = convertColor(oklch, "rgb");
    expect(converted).toEqual(original);
  });

  it("round-trips RGB through HSV", () => {
    const color: RGBColor = { colorSpace: "rgb", r: 240, g: 90, b: 25, alpha: 0.8 };
    const hsv = rgbToHsv(color);
    expect(hsvToRgb(hsv.h, hsv.s, hsv.v, color.alpha)).toEqual(color);
  });

  it("formats valid modern CSS colors", () => {
    expect(colorToCss({ colorSpace: "rgb", r: 1, g: 2, b: 3, alpha: 0.5 })).toBe("rgb(1 2 3 / 0.5)");
    expect(colorToCss({ colorSpace: "oklch", l: 0.7, c: 0.15, h: 250, alpha: 1 })).toBe("oklch(0.7 0.15 250 / 1)");
  });
});
