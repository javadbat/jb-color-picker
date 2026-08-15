# jb-color-picker

A standalone web component for selecting colors in RGB and OKLCH. It deliberately does not behave as a form input; it is designed to be composed into a future color-input component.

```js
import "jb-color-picker";

const picker = document.querySelector("jb-color-picker");
picker.value = { colorSpace: "oklch", l: 0.7, c: 0.15, h: 250, alpha: 1 };
picker.addEventListener("change", event => console.log(event.detail.value));
```

```html
<jb-color-picker color-space="rgb"></jb-color-picker>
```

## Value API

`value` is one of these normalized objects:

```ts
type RGBColor = { colorSpace: "rgb"; r: number; g: number; b: number; alpha: number };
type OKLCHColor = { colorSpace: "oklch"; l: number; c: number; h: number; alpha: number };
```

RGB channels use `0..255`. OKLCH uses `0..1` lightness, `0..0.4` chroma, and `0..360` hue. Alpha uses `0..1`. Setting `colorSpace` converts the current value and preserves alpha.

The component dispatches composed, bubbling `input` and `change` custom events. Both expose the current value at `event.detail.value`. `valueAsString` returns a CSS `rgb(...)` or `oklch(...)` string.

Set `alphaEnabled = false` or add `alpha-disabled` to hide alpha controls. Set `disabled` to disable interaction.

## React

```tsx
import { JBColorPicker } from "jb-color-picker/react";

<JBColorPicker value={{ colorSpace: "rgb", r: 255, g: 80, b: 40, alpha: 1 }} onChange={event => console.log(event.detail.value)} />
```
