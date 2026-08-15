export type ColorSpace = "rgb" | "oklch";

export type RGBColor = {
  colorSpace: "rgb";
  r: number;
  g: number;
  b: number;
  alpha: number;
};

export type OKLCHColor = {
  colorSpace: "oklch";
  l: number;
  c: number;
  h: number;
  alpha: number;
};

export type JBColorPickerValue = RGBColor | OKLCHColor;

export type ColorPickerChangeEvent = CustomEvent<{ value: JBColorPickerValue }>;

export type ColorPickerElements = {
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
