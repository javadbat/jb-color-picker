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
    await waitFor(() => expect(picker.value.colorSpace).toBe("rgb"));
    expect(picker.valueAsString).toBe("rgb(59 102 245 / 1)");

    const oklchButton = picker.shadowRoot!.querySelector<HTMLButtonElement>("[data-space='oklch']")!;
    await userEvent.click(oklchButton);
    expect(picker.colorSpace).toBe("oklch");
    expect(args.onChange).toHaveBeenCalled();

    const expected = rgbToOklch({ colorSpace: "rgb", r: 59, g: 102, b: 245, alpha: 1 });
    if (picker.value.colorSpace !== "oklch") throw new Error("Expected OKLCH value");
    expect(picker.value.l).toBeCloseTo(expected.l, 5);
    expect(picker.value.c).toBeCloseTo(expected.c, 5);
  },
};

export const OKLCH: Story = {
  args: {
    value: { colorSpace: "oklch", l: 0.72, c: 0.16, h: 250, alpha: 0.8 },
  },
  play: async ({ canvasElement }) => {
    const picker = canvasElement.querySelector<JBColorPickerWebComponent>("jb-color-picker")!;
    await waitFor(() => expect(picker.value.colorSpace).toBe("oklch"));
    const before = picker.value.colorSpace === "oklch" ? picker.value.c : 0;
    const surface = picker.shadowRoot!.querySelector<HTMLCanvasElement>(".surface")!;
    surface.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(picker.value.colorSpace).toBe("oklch");
    if (picker.value.colorSpace === "oklch") expect(picker.value.c).toBeGreaterThan(before);

    const rgb = convertColor(picker.value, "rgb");
    expect(rgb.colorSpace).toBe("rgb");
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
