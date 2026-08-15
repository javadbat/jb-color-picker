import type { JBColorPickerValue, OKLCHColor, RGBColor } from "./types.js";

export const MAX_OKLCH_CHROMA = 0.4;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

export function normalizeHue(value: number): number {
  const hue = Number.isFinite(value) ? value % 360 : 0;
  return hue < 0 ? hue + 360 : hue;
}

export function normalizeColor(value: JBColorPickerValue): JBColorPickerValue {
  const alpha = clamp(value.alpha ?? 1, 0, 1);
  if (value.colorSpace === "oklch") {
    return {
      colorSpace: "oklch",
      l: clamp(value.l, 0, 1),
      c: clamp(value.c, 0, MAX_OKLCH_CHROMA),
      h: normalizeHue(value.h),
      alpha,
    };
  }
  return {
    colorSpace: "rgb",
    r: Math.round(clamp(value.r, 0, 255)),
    g: Math.round(clamp(value.g, 0, 255)),
    b: Math.round(clamp(value.b, 0, 255)),
    alpha,
  };
}

export function rgbToHsv({ r, g, b }: Pick<RGBColor, "r" | "g" | "b">): { h: number; s: number; v: number } {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === red) h = 60 * (((green - blue) / delta) % 6);
    else if (max === green) h = 60 * ((blue - red) / delta + 2);
    else h = 60 * ((red - green) / delta + 4);
  }
  return { h: normalizeHue(h), s: max === 0 ? 0 : delta / max, v: max };
}

export function hsvToRgb(h: number, s: number, v: number, alpha = 1): RGBColor {
  const hue = normalizeHue(h);
  const chroma = v * s;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = v - chroma;
  const segment = Math.floor(hue / 60);
  const [red, green, blue] =
    segment === 0
      ? [chroma, x, 0]
      : segment === 1
        ? [x, chroma, 0]
        : segment === 2
          ? [0, chroma, x]
          : segment === 3
            ? [0, x, chroma]
            : segment === 4
              ? [x, 0, chroma]
              : [chroma, 0, x];
  return normalizeColor({ colorSpace: "rgb", r: (red + m) * 255, g: (green + m) * 255, b: (blue + m) * 255, alpha }) as RGBColor;
}

function srgbToLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(channel: number): number {
  const value = channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;
  return clamp(value * 255, 0, 255);
}

export function rgbToOklch(color: RGBColor): OKLCHColor {
  const r = srgbToLinear(color.r);
  const g = srgbToLinear(color.g);
  const b = srgbToLinear(color.b);
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);
  const lightness = 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot;
  const a = 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot;
  const bAxis = 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot;
  return normalizeColor({
    colorSpace: "oklch",
    l: lightness,
    c: Math.sqrt(a * a + bAxis * bAxis),
    h: (Math.atan2(bAxis, a) * 180) / Math.PI,
    alpha: color.alpha,
  }) as OKLCHColor;
}

export function oklchToRgb(color: OKLCHColor): RGBColor {
  const angle = (normalizeHue(color.h) * Math.PI) / 180;
  const a = color.c * Math.cos(angle);
  const bAxis = color.c * Math.sin(angle);
  const lRoot = color.l + 0.3963377774 * a + 0.2158037573 * bAxis;
  const mRoot = color.l - 0.1055613458 * a - 0.0638541728 * bAxis;
  const sRoot = color.l - 0.0894841775 * a - 1.291485548 * bAxis;
  const l = lRoot ** 3;
  const m = mRoot ** 3;
  const s = sRoot ** 3;
  return normalizeColor({
    colorSpace: "rgb",
    r: linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
    alpha: color.alpha,
  }) as RGBColor;
}

export function convertColor(value: JBColorPickerValue, colorSpace: JBColorPickerValue["colorSpace"]): JBColorPickerValue {
  const normalized = normalizeColor(value);
  if (normalized.colorSpace === colorSpace) return normalized;
  return normalized.colorSpace === "rgb" ? rgbToOklch(normalized) : oklchToRgb(normalized);
}

export function colorToCss(value: JBColorPickerValue): string {
  const color = normalizeColor(value);
  if (color.colorSpace === "rgb") return `rgb(${color.r} ${color.g} ${color.b} / ${trim(color.alpha)})`;
  return `oklch(${trim(color.l)} ${trim(color.c)} ${trim(color.h)} / ${trim(color.alpha)})`;
}

/**
 * Parses CSS RGB, RGBA, hexadecimal, and OKLCH colors supported by the picker.
 * Returns null for invalid or unsupported CSS color syntaxes.
 */
export function parseColor(value: string): JBColorPickerValue | null {
  const source = value.trim().toLowerCase();
  if (source.startsWith("#")) return parseHexColor(source);
  if (/^rgba?\(/.test(source)) return parseRgbColor(source);
  if (source.startsWith("oklch(")) return parseOklchColor(source);
  return null;
}

function parseHexColor(source: string): RGBColor | null {
  const hex = source.slice(1);
  if (![3, 4, 6, 8].includes(hex.length) || !/^[\da-f]+$/.test(hex)) return null;
  const expanded = hex.length <= 4 ? [...hex].map(character => character + character).join("") : hex;
  const hasAlpha = expanded.length === 8;
  return normalizeColor({
    colorSpace: "rgb",
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
    alpha: hasAlpha ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1,
  }) as RGBColor;
}

function parseRgbColor(source: string): RGBColor | null {
  const functionMatch = source.match(/^rgba?\((.*)\)$/);
  if (!functionMatch) return null;
  const body = functionMatch[1].trim();
  const commaSyntax = body.includes(",");
  let channels: string[];
  let alphaToken: string | undefined;
  if (commaSyntax) {
    const tokens = body.split(",").map(token => token.trim());
    if (tokens.length !== 3 && tokens.length !== 4) return null;
    channels = tokens.slice(0, 3);
    alphaToken = tokens[3];
  } else {
    const slashParts = body.split("/").map(token => token.trim());
    if (slashParts.length > 2) return null;
    channels = slashParts[0].split(/\s+/);
    alphaToken = slashParts[1];
  }
  if (channels.length !== 3) return null;
  const parsedChannels = channels.map(parseRgbChannel);
  const alpha = alphaToken === undefined ? 1 : parseAlpha(alphaToken);
  if (parsedChannels.some(channel => channel === null) || alpha === null) return null;
  return normalizeColor({
    colorSpace: "rgb",
    r: parsedChannels[0]!,
    g: parsedChannels[1]!,
    b: parsedChannels[2]!,
    alpha,
  }) as RGBColor;
}

function parseOklchColor(source: string): OKLCHColor | null {
  const functionMatch = source.match(/^oklch\((.*)\)$/);
  if (!functionMatch) return null;
  const slashParts = functionMatch[1]
    .trim()
    .split("/")
    .map(token => token.trim());
  if (slashParts.length > 2) return null;
  const channels = slashParts[0].split(/\s+/);
  if (channels.length !== 3) return null;
  const lightness = parseLightness(channels[0]);
  const chroma = parseNumber(channels[1]);
  const hue = parseHue(channels[2]);
  const alpha = slashParts[1] === undefined ? 1 : parseAlpha(slashParts[1]);
  if (lightness === null || chroma === null || hue === null || alpha === null) return null;
  return normalizeColor({ colorSpace: "oklch", l: lightness, c: chroma, h: hue, alpha }) as OKLCHColor;
}

function parseRgbChannel(token: string): number | null {
  if (token.endsWith("%")) {
    const percentage = parseNumber(token.slice(0, -1));
    return percentage === null ? null : (percentage / 100) * 255;
  }
  return parseNumber(token);
}

function parseLightness(token: string): number | null {
  if (token.endsWith("%")) {
    const percentage = parseNumber(token.slice(0, -1));
    return percentage === null ? null : percentage / 100;
  }
  return parseNumber(token);
}

function parseAlpha(token: string): number | null {
  if (token.endsWith("%")) {
    const percentage = parseNumber(token.slice(0, -1));
    return percentage === null ? null : percentage / 100;
  }
  return parseNumber(token);
}

function parseHue(token: string): number | null {
  const match = token.match(/^([-+]?(?:\d+\.?\d*|\.\d+))(deg|grad|rad|turn)?$/);
  if (!match) return null;
  const value = Number(match[1]);
  if (!Number.isFinite(value)) return null;
  if (match[2] === "grad") return value * 0.9;
  if (match[2] === "rad") return (value * 180) / Math.PI;
  if (match[2] === "turn") return value * 360;
  return value;
}

function parseNumber(token: string): number | null {
  if (!/^[-+]?(?:\d+\.?\d*|\.\d+)$/.test(token)) return null;
  const value = Number(token);
  return Number.isFinite(value) ? value : null;
}

function trim(value: number): string {
  return String(Number(value.toFixed(3)));
}
