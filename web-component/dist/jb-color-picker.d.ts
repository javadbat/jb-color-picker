//#region modules/jb-color-picker/web-component/lib/types.d.ts
type ColorSpace = "rgb" | "oklch";
type RGBColor = {
  colorSpace: "rgb";
  r: number;
  g: number;
  b: number;
  alpha: number;
};
type OKLCHColor = {
  colorSpace: "oklch";
  l: number;
  c: number;
  h: number;
  alpha: number;
};
type JBColorPickerValue = RGBColor | OKLCHColor;
type ColorPickerChangeEvent = CustomEvent<{
  value: JBColorPickerValue;
}>;
type ColorPickerElements = {
  surface: HTMLCanvasElement;
  surfaceCursor: HTMLSpanElement;
  hue: HTMLInputElement;
  alpha: HTMLInputElement;
  alphaRow: HTMLElement;
  preview: HTMLElement;
  spaceButtons: NodeListOf<HTMLButtonElement>;
  fields: HTMLElement;
  valueText: HTMLOutputElement;
};
//#endregion
//#region modules/jb-color-picker/web-component/lib/color.d.ts
declare const MAX_OKLCH_CHROMA = 0.4;
declare function clamp(value: number, min: number, max: number): number;
declare function normalizeHue(value: number): number;
declare function normalizeColor(value: JBColorPickerValue): JBColorPickerValue;
declare function rgbToHsv({
  r,
  g,
  b
}: Pick<RGBColor, "r" | "g" | "b">): {
  h: number;
  s: number;
  v: number;
};
declare function hsvToRgb(h: number, s: number, v: number, alpha?: number): RGBColor;
declare function rgbToOklch(color: RGBColor): OKLCHColor;
declare function oklchToRgb(color: OKLCHColor): RGBColor;
declare function convertColor(value: JBColorPickerValue, colorSpace: JBColorPickerValue["colorSpace"]): JBColorPickerValue;
declare function colorToCss(value: JBColorPickerValue): string;
//#endregion
//#region modules/jb-color-picker/web-component/lib/jb-color-picker.d.ts
declare class JBColorPickerWebComponent extends HTMLElement {
  #private;
  static get observedAttributes(): string[];
  elements: ColorPickerElements;
  constructor();
  connectedCallback(): void;
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
  get value(): JBColorPickerValue;
  set value(value: JBColorPickerValue);
  get valueAsString(): string;
  get colorSpace(): ColorSpace;
  set colorSpace(value: ColorSpace);
  get alphaEnabled(): boolean;
  set alphaEnabled(value: boolean);
  get disabled(): boolean;
  set disabled(value: boolean);
}
declare global {
  interface HTMLElementTagNameMap {
    "jb-color-picker": JBColorPickerWebComponent;
  }
} //# sourceMappingURL=jb-color-picker.d.ts.map
//#endregion
export { ColorPickerChangeEvent, ColorPickerElements, ColorSpace, JBColorPickerValue, JBColorPickerWebComponent, MAX_OKLCH_CHROMA, OKLCHColor, RGBColor, clamp, colorToCss, convertColor, hsvToRgb, normalizeColor, normalizeHue, oklchToRgb, rgbToHsv, rgbToOklch };
//# sourceMappingURL=jb-color-picker.d.ts.map