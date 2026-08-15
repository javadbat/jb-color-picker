# jb-color-picker

A standalone web component for selecting colors in RGB and OKLCH. It deliberately does not behave as a form input; it is designed to be composed into a future color-input component.

```js
import "jb-color-picker";

const picker = document.querySelector("jb-color-picker");
picker.value = { colorSpace: "oklch", l: 0.7, c: 0.15, h: 250, alpha: 1 };
picker.value = "oklch(70% 0.15 250 / 1)";
picker.addEventListener("change", event => console.log(event.detail.value, event.detail.valueObject));
```

```html
<jb-color-picker color-space="rgb"></jb-color-picker>
```

## Value API

The `value` getter returns a normalized CSS color string. Its setter accepts either a supported CSS color string or one of these typed objects:

```ts
type RGBColor = { colorSpace: "rgb"; r: number; g: number; b: number; alpha: number };
type OKLCHColor = { colorSpace: "oklch"; l: number; c: number; h: number; alpha: number };
```

Supported string syntaxes are modern or comma-separated `rgb()`/`rgba()`, `oklch()`, and 3/4/6/8-digit hexadecimal colors. Invalid or unsupported strings are ignored. Use the readonly `valueObject` getter to retrieve the normalized typed object.

RGB channels use `0..255`. OKLCH uses `0..1` lightness, `0..0.4` chroma, and `0..360` hue. Alpha uses `0..1`.

`colorSpace` defaults to `null`, which displays the RGB/OKLCH switch. Setting it to `"rgb"` or `"oklch"` locks the picker to that space, converts the current color, and hides the switch. Set it back to `null` to let the user switch again.

The component dispatches composed, bubbling `input` and `change` custom events. Both expose the CSS string at `event.detail.value` and typed data at `event.detail.valueObject`. `valueAsString` remains an alias of `value`.

Set `alphaEnabled = false` or add `alpha-disabled` to hide alpha controls. Set `disabled` to disable interaction.

## React

```tsx
import { JBColorPicker } from "jb-color-picker/react";

<JBColorPicker value="rgb(255 80 40 / 1)" colorSpace="rgb" onChange={event => console.log(event.detail.valueObject)} />
```
