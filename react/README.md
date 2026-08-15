# jb-color-picker React component

[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://raw.githubusercontent.com/javadbat/jb-color-picker/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/jb-color-picker)](https://www.npmjs.com/package/jb-color-picker)

React wrapper for [`jb-color-picker`](https://github.com/javadbat/jb-color-picker). It imports and registers the underlying web component, maps React props to its properties, forwards its typed events, and exposes the web-component instance through a ref.

## Demo

- [Interactive Storybook demo](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--rgb)
- [OKLCH demo](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--oklch)
- [Size variants](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--size-variants)
- [Disabled state](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--disabled)

## Installation

```sh
npm i jb-color-picker
```

```tsx
import { JBColorPicker } from "jb-color-picker/react";
```

## Basic usage

```tsx
import { useState } from "react";
import type { JBColorPickerValue } from "jb-color-picker";
import { JBColorPicker } from "jb-color-picker/react";

export function ColorPickerExample() {
  const [value, setValue] = useState<JBColorPickerValue>({
    colorSpace: "rgb",
    r: 59,
    g: 102,
    b: 245,
    alpha: 1,
  });

  return <JBColorPicker value={value} onChange={event => setValue(event.detail.valueObject)} />;
}
```

## Props

| prop | type | description |
| --- | --- | --- |
| `value` | `JBColorPickerValue \| string` | Color supplied as a typed RGB/OKLCH object or supported CSS string. |
| `colorSpace` | `"rgb" \| "oklch" \| null` | Locks the picker to one space. Use `null` to let the user switch. [Demo](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--locked-rgb) |
| `alphaEnabled` | `boolean` | Shows or hides the alpha slider and field. [Demo](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--without-alpha) |
| `disabled` | `boolean` | Disables all picker interaction. [Demo](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--disabled) |
| `onInput` | `(event: ColorPickerChangeEvent) => void` | Called during user changes. |
| `onChange` | `(event: ColorPickerChangeEvent) => void` | Called when a user change is committed. |

Standard element props such as `className`, `style`, `id`, `aria-*`, and `data-*` are also forwarded to `<jb-color-picker>`.

## Event values

Both handlers receive a custom event whose `detail` contains normalized string and typed representations:

```tsx
<JBColorPicker
  value="#3b66f5cc"
  onInput={event => console.log(event.detail.value)}
  onChange={event => console.log(event.detail.valueObject)}
/>;
```

Use `onInput` for live previews and `onChange` for committed application state.

## Lock a color space

```tsx
<JBColorPicker colorSpace="oklch" value={{ colorSpace: "oklch", l: 0.72, c: 0.16, h: 250, alpha: 0.8 }} />;
```

The picker converts a supplied value to the locked space. Omit `colorSpace` or set it to `null` to show the RGB/OKLCH switch.

## Alpha and disabled states

```tsx
<JBColorPicker alphaEnabled={false} />
<JBColorPicker disabled value="rgb(120 120 120 / 1)" />
```

## Ref access

The forwarded ref exposes `JBColorPickerWebComponent`, including `valueObject`, `colorSpace`, and `elements`.

```tsx
import { useRef } from "react";
import type { JBColorPickerWebComponent } from "jb-color-picker";

const pickerRef = useRef<JBColorPickerWebComponent>(null);

<JBColorPicker ref={pickerRef} />;
```

## Styling and size

The React wrapper uses the web component's CSS variables and parts. There is no `size` prop; set `--jb-color-picker-width` through CSS or `style`. [See the size variants demo](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--size-variants).

```tsx
import type { CSSProperties } from "react";

<JBColorPicker style={{ "--jb-color-picker-width": "22rem" } as CSSProperties} />
```

See the shared [CSS variables and parts](../README.md#css-variables) for all styling hooks.

## Shared documentation

For supported CSS strings, typed values, normalization, keyboard behavior, events, CSS variables, and CSS parts, see the shared [`jb-color-picker` documentation](../README.md).

## Related docs

- See [`jb-color-picker`](https://github.com/javadbat/jb-color-picker) for pure JavaScript and web-component usage.
- See [`jb-color-input`](https://github.com/javadbat/jb-color-input) for a complete form input.
- See [all JB Design System components](https://javadbat.github.io/design-system/).

## AI agent notes

- Import `JBColorPicker` from `jb-color-picker/react`; the wrapper registers the underlying custom element.
- Use `event.detail.value` for normalized CSS text and `event.detail.valueObject` for typed data.
- Use React property names `colorSpace` and `alphaEnabled`, not HTML attributes `color-space` and `alpha-disabled`.
- The wrapper is uncontrolled internally; pass updated `value` state from `onInput` or `onChange` when a controlled React flow is required.
- Use a ref for imperative access to the underlying web component.
