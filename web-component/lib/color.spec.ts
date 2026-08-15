import { describe, expect, it } from "vitest";
import { colorToCss, convertColor, hsvToRgb, normalizeColor, parseColor, rgbToHsv } from "./color.js";
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

  it("parses RGB CSS color syntaxes", () => {
    expect(parseColor("rgb(10 20 30 / 50%)")).toEqual({ colorSpace: "rgb", r: 10, g: 20, b: 30, alpha: 0.5 });
    expect(parseColor("rgba(100%, 0%, 50%, 0.25)")).toEqual({ colorSpace: "rgb", r: 255, g: 0, b: 128, alpha: 0.25 });
    expect(parseColor("#3366ff80")).toEqual({ colorSpace: "rgb", r: 51, g: 102, b: 255, alpha: 128 / 255 });
  });

  it("parses OKLCH CSS colors and hue units", () => {
    expect(parseColor("oklch(70% 0.15 0.5turn / 80%)")).toEqual({ colorSpace: "oklch", l: 0.7, c: 0.15, h: 180, alpha: 0.8 });
    expect(parseColor("oklch(0.5 0.1 3.141592653589793rad)")).toEqual({ colorSpace: "oklch", l: 0.5, c: 0.1, h: 180, alpha: 1 });
  });

  it("rejects invalid and unsupported CSS colors", () => {
    expect(parseColor("red")).toBeNull();
    expect(parseColor("rgb(1 2)")).toBeNull();
    expect(parseColor("oklch(0.5 nope 20)")).toBeNull();
  });
});
