import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import type { JBColorPickerValue, JBColorPickerWebComponent } from "jb-color-picker";
import type { JBNumberInputWebComponent } from "jb-number-input";
import { convertColor, rgbToOklch } from "jb-color-picker";
import { JBColorPicker } from "jb-color-picker/react";

const meta = {
  title: "Components/JBColorPicker",
  component: JBColorPicker,
  args: {
    value: { colorSpace: "rgb", r: 59, g: 102, b: 245, alpha: 1 },
    alphaEnabled: true,
    disabled: false,
    onInput: fn(),
    onChange: fn(),
  },
  argTypes: {
    colorSpace: { control: "inline-radio", options: ["rgb", "oklch"] },
    alphaEnabled: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof JBColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;
type PickerStyle = CSSProperties & Record<`--jb-color-picker-${string}`, string>;

export const RGB: Story = {
  play: async ({ canvasElement, args }) => {
    const picker = canvasElement.querySelector<JBColorPickerWebComponent>("jb-color-picker")!;
    await waitFor(() => expect(picker.valueObject.colorSpace).toBe("rgb"));
    expect(picker.value).toBe("rgb(59 102 245 / 1)");
    expect(picker.colorSpace).toBeNull();

    const redField = picker.shadowRoot!.querySelector<JBNumberInputWebComponent>("jb-number-input[data-channel='r']")!;
    const redInput = redField.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    redInput.focus();
    await userEvent.keyboard("{Control>}a{/Control}1");
    for (const character of ["2", "3"]) {
      if (picker.valueObject.colorSpace !== "rgb") throw new Error("Expected RGB value");
      picker.value = { ...picker.valueObject, r: Number(redField.value) };
      expect(picker.shadowRoot!.querySelector("jb-number-input[data-channel='r']")).toBe(redField);
      expect(redInput.getRootNode()).toHaveProperty("activeElement", redInput);
      await userEvent.keyboard(character);
    }
    if (picker.valueObject.colorSpace !== "rgb") throw new Error("Expected RGB value");
    picker.value = { ...picker.valueObject, r: Number(redField.value) };
    expect(picker.shadowRoot!.querySelector("jb-number-input[data-channel='r']")).toBe(redField);
    expect(redInput.getRootNode()).toHaveProperty("activeElement", redInput);
    const rgbBeforeSwitch = picker.valueObject;

    const oklchButton = picker.shadowRoot!.querySelector<HTMLButtonElement>("[data-space='oklch']")!;
    await userEvent.click(oklchButton);
    expect(picker.colorSpace).toBeNull();
    expect(picker.valueObject.colorSpace).toBe("oklch");
    expect(args.onChange).toHaveBeenCalled();

    if (rgbBeforeSwitch.colorSpace !== "rgb") throw new Error("Expected RGB value");
    const expected = rgbToOklch(rgbBeforeSwitch);
    const oklchValue = picker.valueObject as JBColorPickerValue;
    if (oklchValue.colorSpace !== "oklch") throw new Error("Expected OKLCH value");
    expect(oklchValue.l).toBeCloseTo(expected.l, 5);
    expect(oklchValue.c).toBeCloseTo(expected.c, 5);
  },
};

export const OKLCH: Story = {
  args: {
    value: { colorSpace: "oklch", l: 0.72, c: 0.16, h: 250, alpha: 0.8 },
  },
  play: async ({ canvasElement }) => {
    const picker = canvasElement.querySelector<JBColorPickerWebComponent>("jb-color-picker")!;
    await waitFor(() => expect(picker.valueObject.colorSpace).toBe("oklch"));
    const before = picker.valueObject.colorSpace === "oklch" ? picker.valueObject.c : 0;
    const surface = picker.shadowRoot!.querySelector<HTMLCanvasElement>(".surface")!;
    surface.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(picker.valueObject.colorSpace).toBe("oklch");
    if (picker.valueObject.colorSpace === "oklch") expect(picker.valueObject.c).toBeGreaterThan(before);

    const rgb = convertColor(picker.valueObject, "rgb");
    expect(rgb.colorSpace).toBe("rgb");
  },
};

export const LockedRGB: Story = {
  args: {
    colorSpace: "rgb",
    value: "oklch(0.72 0.16 250 / 0.8)",
  },
  play: async ({ canvasElement }) => {
    const picker = canvasElement.querySelector<JBColorPickerWebComponent>("jb-color-picker")!;
    await waitFor(() => expect(picker.colorSpace).toBe("rgb"));
    expect(picker.valueObject.colorSpace).toBe("rgb");
    expect(picker.shadowRoot!.querySelector<HTMLElement>(".space-switch")!.hidden).toBe(true);

    picker.colorSpace = null;
    expect(picker.shadowRoot!.querySelector<HTMLElement>(".space-switch")!.hidden).toBe(false);
    picker.colorSpace = "rgb";
  },
};

export const LockedOKLCH: Story = {
  args: {
    colorSpace: "oklch",
    value: "rgb(59 102 245 / 0.75)",
  },
  play: async ({ canvasElement }) => {
    const picker = canvasElement.querySelector<JBColorPickerWebComponent>("jb-color-picker")!;
    await waitFor(() => expect(picker.valueObject.colorSpace).toBe("oklch"));
    expect(picker.colorSpace).toBe("oklch");
    expect(picker.shadowRoot!.querySelector<HTMLElement>(".space-switch")!.hidden).toBe(true);
    expect(picker.valueObject.alpha).toBeCloseTo(0.75, 2);
  },
};

export const CSSColorStrings: Story = {
  args: {
    value: "#3b66f580",
  },
  play: async ({ canvasElement }) => {
    const picker = canvasElement.querySelector<JBColorPickerWebComponent>("jb-color-picker")!;
    await waitFor(() => expect(picker.valueObject.colorSpace).toBe("rgb"));
    if (picker.valueObject.colorSpace !== "rgb") throw new Error("Expected RGB value");
    expect(picker.valueObject.r).toBe(59);
    expect(picker.valueObject.g).toBe(102);
    expect(picker.valueObject.b).toBe(245);
    expect(picker.valueObject.alpha).toBeCloseTo(128 / 255, 3);
  },
};

export const WithoutAlpha: Story = {
  args: { alphaEnabled: false },
  play: async ({ canvasElement }) => {
    const picker = canvasElement.querySelector<JBColorPickerWebComponent>("jb-color-picker")!;
    await waitFor(() => expect(picker.alphaEnabled).toBe(false));
    expect(getComputedStyle(picker.shadowRoot!.querySelector(".alpha-row")!).display).toBe("none");
    expect(picker.shadowRoot!.querySelector("input[data-channel='alpha']")).toBeNull();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const picker = canvasElement.querySelector<JBColorPickerWebComponent>("jb-color-picker")!;
    await waitFor(() => expect(picker.disabled).toBe(true));
    expect(picker.shadowRoot!.querySelector<HTMLInputElement>(".hue")!.disabled).toBe(true);
    expect(picker.shadowRoot!.querySelector<HTMLInputElement>(".alpha")!.disabled).toBe(true);
    expect(picker.shadowRoot!.querySelector<HTMLCanvasElement>(".surface")!.tabIndex).toBe(-1);
    expect(Array.from(picker.shadowRoot!.querySelectorAll<HTMLButtonElement>("button")).every(button => button.disabled)).toBe(true);
    expect(Array.from(picker.shadowRoot!.querySelectorAll<JBNumberInputWebComponent>("jb-number-input")).every(input => input.disabled)).toBe(true);
  },
};

export const SizeVariants: Story = {
  render: () => {
    const variants = [
      { label: "Compact", width: "14rem", value: "#ef4444" },
      { label: "Default", width: "18rem", value: "#3b66f5" },
      { label: "Large", width: "22rem", value: "oklch(72% 0.16 150)" },
    ];

    return (
      <div style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap", gap: "2rem" }}>
        {variants.map(variant => (
          <div key={variant.label}>
            <h3 style={{ marginBlockStart: 0 }}>{variant.label}</h3>
            <JBColorPicker aria-label={`${variant.label} color picker`} value={variant.value} style={{ "--jb-color-picker-width": variant.width } as PickerStyle} />
          </div>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const pickers = Array.from(canvasElement.querySelectorAll<JBColorPickerWebComponent>("jb-color-picker"));
    await waitFor(() => expect(pickers).toHaveLength(3));
    const widths = pickers.map(picker => parseFloat(getComputedStyle(picker.shadowRoot!.querySelector<HTMLElement>(".picker")!).width));
    expect(widths).toEqual([...widths].sort((a, b) => a - b));
    expect(new Set(widths).size).toBe(3);
  },
};

export const CustomTheme: Story = {
  args: {
    value: "oklch(72% 0.16 300 / 0.85)",
    style: {
      "--jb-color-picker-background": "#111827",
      "--jb-color-picker-color": "#f9fafb",
      "--jb-color-picker-border-color": "#374151",
      "--jb-color-picker-accent-color": "#a78bfa",
      "--jb-color-picker-border-radius": "1.25rem",
    } as PickerStyle,
  },
};
