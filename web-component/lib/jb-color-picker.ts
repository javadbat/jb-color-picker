import CSS from "./jb-color-picker.css";
import VariablesCSS from "./variables.css";
import { registerDefaultVariables } from "jb-core/theme";
import type { JBNumberInputWebComponent } from "jb-number-input";
import { colorToCss, convertColor, hsvToRgb, MAX_OKLCH_CHROMA, normalizeColor, oklchToRgb, parseColor, rgbToHsv } from "./color.js";
import { createFieldElement, createPickerContent } from "./render.js";
import type { ColorPickerChangeEvent, ColorPickerElements, ColorSpace, JBColorPickerValue, RGBColor } from "./types.js";
import { JBBaseComponent } from "jb-core";
export * from "./types.js";
export * from "./color.js";

const FIELD_CONFIG = {
  rgb: [
    { key: "r", label: "R", min: 0, max: 255, step: 1, decimalPrecision: 0, acceptNegative: false },
    { key: "g", label: "G", min: 0, max: 255, step: 1, decimalPrecision: 0, acceptNegative: false },
    { key: "b", label: "B", min: 0, max: 255, step: 1, decimalPrecision: 0, acceptNegative: false },
    { key: "alpha", label: "Alpha", min: 0, max: 1, step: 0.01, decimalPrecision: 2, acceptNegative: false },
  ],
  oklch: [
    { key: "l", label: "L", min: 0, max: 1, step: 0.01, decimalPrecision: 2, acceptNegative: false },
    { key: "c", label: "C", min: 0, max: MAX_OKLCH_CHROMA, step: 0.001, decimalPrecision: 3, acceptNegative: false },
    { key: "h", label: "H", min: 0, max: 360, step: 1, decimalPrecision: 0, acceptNegative: false },
    { key: "alpha", label: "Alpha", min: 0, max: 1, step: 0.01, decimalPrecision: 2, acceptNegative: false },
  ],
} as const;

export class JBColorPickerWebComponent extends JBBaseComponent {
  static get observedAttributes(): string[] {
    return ["color-space", "alpha-disabled", "disabled"];
  }

  elements: ColorPickerElements;
  #value: JBColorPickerValue = { colorSpace: "rgb", r: 59, g: 102, b: 245, alpha: 1 };
  #colorSpace: ColorSpace | null = null;
  #rgbHue = rgbToHsv(this.#value as RGBColor).h;
  #surfacePointerActive = false;
  #internals?: ElementInternals;

  constructor() {
    super();
    if (typeof this.attachInternals === "function") {
      this.#internals = this.attachInternals();
      this.#internals.role = "group";
      this.#internals.ariaLabel = "Color picker";
    }
    const shadowRoot = this.attachShadow({ mode: "open", clonable: true, serializable: true });
    registerDefaultVariables();
    shadowRoot.appendChild(createPickerContent(`${CSS} ${VariablesCSS}`));
    this.elements = {
      surface: shadowRoot.querySelector(".surface")!,
      surfaceCursor: shadowRoot.querySelector(".surface-cursor")!,
      hue: shadowRoot.querySelector(".hue")!,
      alpha: shadowRoot.querySelector(".alpha")!,
      alphaRow: shadowRoot.querySelector(".alpha-row")!,
      preview: shadowRoot.querySelector(".preview")!,
      spaceSwitch: shadowRoot.querySelector(".space-switch")!,
      spaceButtons: shadowRoot.querySelectorAll("[data-space]"),
      fields: shadowRoot.querySelector(".fields")!,
      valueText: shadowRoot.querySelector(".value-text")!,
    };
    this.elements.surface.tabIndex = 0;
    this.elements.surface.setAttribute("role", "group");
    this.#registerEvents();
  }

  connectedCallback(): void {
    const attributeSpace = this.getAttribute("color-space");
    this.#colorSpace = attributeSpace === "rgb" || attributeSpace === "oklch" ? attributeSpace : null;
    if (this.#colorSpace && this.#colorSpace !== this.#value.colorSpace) {
      this.#value = convertColor(this.#value, this.#colorSpace);
      this.#syncHue();
    }
    this.#updateView();
    this.dispatchEvent(new CustomEvent("load", { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent("init", { bubbles: true, composed: true }));
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === "color-space") {
      this.#colorSpace = newValue === "rgb" || newValue === "oklch" ? newValue : null;
      if (this.#colorSpace && this.#colorSpace !== this.#value.colorSpace) {
        this.#value = convertColor(this.#value, this.#colorSpace);
        this.#syncHue();
      }
    }
    this.#updateView();
  }

  get value(): string {
    return colorToCss(this.#value);
  }

  set value(value: JBColorPickerValue | string) {
    const parsedValue = typeof value === "string" ? parseColor(value) : value && (value.colorSpace === "rgb" || value.colorSpace === "oklch") ? normalizeColor(value) : null;
    if (!parsedValue) return;
    this.#value = this.#colorSpace ? convertColor(parsedValue, this.#colorSpace) : parsedValue;
    this.#syncHue();
    this.#updateView();
  }

  get valueObject(): JBColorPickerValue {
    return { ...this.#value };
  }

  get colorSpace(): ColorSpace | null {
    return this.#colorSpace;
  }

  set colorSpace(value: ColorSpace | null) {
    if (value === null) {
      this.#colorSpace = null;
      if (this.hasAttribute("color-space")) this.removeAttribute("color-space");
      else this.#updateView();
      return;
    }
    if (value !== "rgb" && value !== "oklch") return;
    this.#colorSpace = value;
    if (value !== this.#value.colorSpace) {
      this.#value = convertColor(this.#value, value);
      this.#syncHue();
    }
    if (this.getAttribute("color-space") !== value) this.setAttribute("color-space", value);
    this.#updateView();
  }

  get alphaEnabled(): boolean {
    return !this.hasAttribute("alpha-disabled");
  }

  set alphaEnabled(value: boolean) {
    this.toggleAttribute("alpha-disabled", !value);
  }

  get disabled(): boolean {
    return this.hasAttribute("disabled");
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", Boolean(value));
  }

  #registerEvents(): void {
    this.elements.spaceButtons.forEach(button => {
      button.addEventListener("click", () => {
        if (this.disabled) return;
        const space = button.dataset.space as ColorSpace;
        if (this.#colorSpace !== null || space === this.#value.colorSpace) return;
        this.#value = convertColor(this.#value, space);
        this.#syncHue();
        this.#updateView();
        this.#emit("input");
        this.#emit("change");
      });
    });
    this.elements.hue.addEventListener("input", () => {
      this.#setHue(Number(this.elements.hue.value));
      this.#emit("input");
    });
    this.elements.hue.addEventListener("change", () => this.#emit("change"));
    this.elements.alpha.addEventListener("input", () => {
      this.#setAlpha(Number(this.elements.alpha.value));
      this.#emit("input");
    });
    this.elements.alpha.addEventListener("change", () => this.#emit("change"));
    this.elements.surface.addEventListener("pointerdown", event => this.#startSurfacePointer(event));
    this.elements.surface.addEventListener("pointermove", event => this.#moveSurfacePointer(event));
    this.elements.surface.addEventListener("pointerup", event => this.#endSurfacePointer(event));
    this.elements.surface.addEventListener("pointercancel", event => this.#endSurfacePointer(event));
    this.elements.surface.addEventListener("keydown", event => this.#handleSurfaceKeydown(event));
  }

  #startSurfacePointer(event: PointerEvent): void {
    if (this.disabled) return;
    this.#surfacePointerActive = true;
    this.elements.surface.setPointerCapture(event.pointerId);
    this.#setSurfaceFromPointer(event);
    this.#emit("input");
  }

  #moveSurfacePointer(event: PointerEvent): void {
    if (!this.#surfacePointerActive || this.disabled) return;
    this.#setSurfaceFromPointer(event);
    this.#emit("input");
  }

  #endSurfacePointer(event: PointerEvent): void {
    if (!this.#surfacePointerActive) return;
    this.#surfacePointerActive = false;
    if (this.elements.surface.hasPointerCapture(event.pointerId)) this.elements.surface.releasePointerCapture(event.pointerId);
    this.#emit("change");
  }

  #setSurfaceFromPointer(event: PointerEvent): void {
    const rect = this.elements.surface.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    this.#setSurfaceValue(x, y);
  }

  #handleSurfaceKeydown(event: KeyboardEvent): void {
    if (this.disabled || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const amount = event.shiftKey ? 0.1 : 0.01;
    const current = this.#getSurfacePosition();
    const x = current.x + (event.key === "ArrowRight" ? amount : event.key === "ArrowLeft" ? -amount : 0);
    const y = current.y + (event.key === "ArrowDown" ? amount : event.key === "ArrowUp" ? -amount : 0);
    this.#setSurfaceValue(Math.min(1, Math.max(0, x)), Math.min(1, Math.max(0, y)));
    this.#emit("input");
    this.#emit("change");
  }

  #setSurfaceValue(x: number, y: number): void {
    if (this.#value.colorSpace === "rgb") {
      this.#value = hsvToRgb(this.#rgbHue, x, 1 - y, this.#value.alpha);
    } else {
      this.#value = normalizeColor({ ...this.#value, c: x * MAX_OKLCH_CHROMA, l: 1 - y });
    }
    this.#updateView(false);
  }

  #setHue(hue: number): void {
    if (this.#value.colorSpace === "rgb") {
      const hsv = rgbToHsv(this.#value);
      this.#rgbHue = hue;
      this.#value = hsvToRgb(hue, hsv.s, hsv.v, this.#value.alpha);
    } else {
      this.#value = normalizeColor({ ...this.#value, h: hue });
    }
    this.#updateView();
  }

  #setAlpha(alpha: number): void {
    this.#value = normalizeColor({ ...this.#value, alpha } as JBColorPickerValue);
    this.#updateView(false);
  }

  #handleFieldChange(event: Event): void {
    const input = (event.target as HTMLElement).closest<JBNumberInputWebComponent>("jb-number-input[data-channel]");
    if (!input || this.disabled) return;
    const key = input.dataset.channel!;
    const numericValue = Number(input.value);
    if (!Number.isFinite(numericValue)) {
      this.#updateFieldValues();
      return;
    }
    this.#value = normalizeColor({ ...this.#value, [key]: numericValue } as JBColorPickerValue);
    this.#syncHue();
    this.#updateView();
    this.#emit("input");
    this.#emit("change");
  }

  #syncHue(): void {
    if (this.#value.colorSpace === "rgb") {
      const hsv = rgbToHsv(this.#value);
      if (hsv.s > 0) this.#rgbHue = hsv.h;
    }
  }

  #updateView(updateSurfacePixels = true): void {
    if (!this.isConnected) return;
    const cssColor = colorToCss(this.#value);
    const opaqueColor = colorToCss({ ...this.#value, alpha: 1 } as JBColorPickerValue);
    this.style.setProperty("--selected-color", cssColor);
    this.elements.hue.value = String(this.#value.colorSpace === "rgb" ? this.#rgbHue : this.#value.h);
    this.elements.alpha.value = String(this.#value.alpha);
    this.elements.alpha.disabled = this.disabled;
    this.elements.hue.disabled = this.disabled;
    this.elements.alpha.style.setProperty("--selected-color", opaqueColor);
    this.elements.valueText.value = cssColor;
    this.elements.valueText.textContent = cssColor;
    this.elements.surface.tabIndex = this.disabled ? -1 : 0;
    this.elements.spaceSwitch.hidden = this.#colorSpace !== null;
    this.elements.spaceButtons.forEach(button => {
      const selected = button.dataset.space === this.#value.colorSpace;
      button.setAttribute("aria-pressed", String(selected));
      button.disabled = this.disabled;
    });
    const position = this.#getSurfacePosition();
    this.elements.surfaceCursor.style.left = `${position.x * 100}%`;
    this.elements.surfaceCursor.style.top = `${position.y * 100}%`;
    this.elements.surface.setAttribute("aria-label", this.#value.colorSpace === "rgb" ? "Saturation and brightness" : "Chroma and lightness");
    this.elements.surface.setAttribute("aria-description", cssColor);
    if (this.#internals) this.#internals.ariaDescription = cssColor;
    this.#updateFieldValues();
    if (updateSurfacePixels) this.#drawSurface();
  }

  #updateFieldValues(): void {
    const existingInputs = new Map(
      Array.from(this.elements.fields.querySelectorAll<JBNumberInputWebComponent>("jb-number-input[data-channel]")).map(input => [input.dataset.channel!, input]),
    );
    const nextInputs: JBNumberInputWebComponent[] = [];
    for (const config of FIELD_CONFIG[this.#value.colorSpace]) {
      if (config.key === "alpha" && !this.alphaEnabled) continue;
      let input = existingInputs.get(config.key);
      if (!input) input = createFieldElement(config.key, event => this.#handleFieldChange(event));
      if (input.getAttribute("label") !== config.label) input.setAttribute("label", config.label);
      input.minValue = config.min;
      input.maxValue = config.max;
      input.step = config.step;
      input.decimalPrecision = config.decimalPrecision;
      input.acceptNegative = config.acceptNegative;
      input.showControlButton = true;
      input.disabled = this.disabled;
      const value = String(Number((this.#value as unknown as Record<string, number>)[config.key].toFixed(config.key === "c" ? 3 : config.step < 1 ? 2 : 0)));
      if (input.value !== value) input.value = value;
      input.setAttribute("aria-label", config.label);
      nextInputs.push(input);
    }
    const currentInputs = Array.from(this.elements.fields.children);
    if (currentInputs.length !== nextInputs.length || currentInputs.some((input, index) => input !== nextInputs[index])) {
      this.elements.fields.replaceChildren(...nextInputs);
    }
  }

  #getSurfacePosition(): { x: number; y: number } {
    if (this.#value.colorSpace === "rgb") {
      const hsv = rgbToHsv(this.#value);
      return { x: hsv.s, y: 1 - hsv.v };
    }
    return { x: this.#value.c / MAX_OKLCH_CHROMA, y: 1 - this.#value.l };
  }

  #drawSurface(): void {
    const canvas = this.elements.surface;
    const context = canvas.getContext("2d");
    if (!context) return;
    const { width, height } = canvas;
    const image = context.createImageData(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const xRatio = x / (width - 1);
        const yRatio = y / (height - 1);
        const rgb =
          this.#value.colorSpace === "rgb"
            ? hsvToRgb(this.#rgbHue, xRatio, 1 - yRatio)
            : oklchToRgb({ colorSpace: "oklch", l: 1 - yRatio, c: xRatio * MAX_OKLCH_CHROMA, h: this.#value.h, alpha: 1 });
        const offset = (y * width + x) * 4;
        image.data[offset] = rgb.r;
        image.data[offset + 1] = rgb.g;
        image.data[offset + 2] = rgb.b;
        image.data[offset + 3] = 255;
      }
    }
    context.putImageData(image, 0, 0);
  }

  #emit(type: "input" | "change"): void {
    const event: ColorPickerChangeEvent = new CustomEvent(type, {
      detail: { value: this.value, valueObject: this.valueObject },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

if (!customElements.get("jb-color-picker")) {
  customElements.define("jb-color-picker", JBColorPickerWebComponent);
}

declare global {
  interface HTMLElementTagNameMap {
    "jb-color-picker": JBColorPickerWebComponent;
  }
}
