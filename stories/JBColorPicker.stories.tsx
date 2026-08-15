import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import type { JBColorPickerWebComponent } from "jb-color-picker";
import { convertColor, rgbToOklch } from "jb-color-picker";
import { JBColorPicker } from "jb-color-picker/react";

const meta = {
  title: "Components/Pickers/JBColorPicker",
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

export const RGB: Story = {
  play: async ({ canvasElement, args }) => {
    const picker = canvasElement.querySelector<JBColorPickerWebComponent>("jb-color-picker")!;
    await waitFor(() => expect(picker.valueObject.colorSpace).toBe("rgb"));
    expect(picker.value).toBe("rgb(59 102 245 / 1)");
    expect(picker.colorSpace).toBeNull();

    const oklchButton = picker.shadowRoot!.querySelector<HTMLButtonElement>("[data-space='oklch']")!;
    await userEvent.click(oklchButton);
    expect(picker.colorSpace).toBeNull();
    expect(picker.valueObject.colorSpace).toBe("oklch");
    expect(args.onChange).toHaveBeenCalled();

    const expected = rgbToOklch({ colorSpace: "rgb", r: 59, g: 102, b: 245, alpha: 1 });
    if (picker.valueObject.colorSpace !== "oklch") throw new Error("Expected OKLCH value");
    expect(picker.valueObject.l).toBeCloseTo(expected.l, 5);
    expect(picker.valueObject.c).toBeCloseTo(expected.c, 5);
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
    expect(picker.shadowRoot!.querySelector<HTMLCanvasElement>(".surface")!.tabIndex).toBe(-1);
  },
};
