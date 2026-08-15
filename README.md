# jb-color-picker

[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://raw.githubusercontent.com/javadbat/jb-color-picker/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/jb-color-picker)](https://www.npmjs.com/package/jb-color-picker)
![GitHub Created At](https://img.shields.io/github/created-at/javadbat/jb-color-picker)

`jb-color-picker` is a standalone RGB and OKLCH color picker web component. It provides a two-dimensional color surface, hue and alpha sliders, editable numeric channels, and normalized CSS color output.

- Supports RGB and OKLCH color spaces.
- Accepts CSS `rgb()`, `rgba()`, `oklch()`, and hexadecimal color strings.
- Accepts typed RGB and OKLCH value objects.
- Supports optional alpha controls.
- Supports locked or user-selectable color spaces.
- Supports disabled state and keyboard interaction.
- Dispatches composed, bubbling `input` and `change` events.
- Supports TypeScript and React.
- Supports custom styling with CSS variables and CSS parts.

## When to use

Use `jb-color-picker` when an application needs an embeddable color-selection surface and manages its own input, popover, form, or validation behavior. The component deliberately is not form-associated and does not render a text-field trigger.

Use [`jb-color-input`](https://github.com/javadbat/jb-color-input) when users need a complete color form input with a trigger and picker popover.

## Demo

- [Storybook](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--rgb)

## Using with JS frameworks

<a href="https://github.com/javadbat/jb-color-picker/tree/main/react" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/React.js-jb--color--picker%2Freact-000.svg?logo=react&logoColor=%2361DAFB" height="30" /></a> See the [React documentation](https://javadbat.github.io/design-system/?path=/docs/components-jbcolorpicker-react-readme--docs).

Other integrations: <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#angular" target="_blank" rel="noopener noreferrer">Angular</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#vue" target="_blank" rel="noopener noreferrer">Vue</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#nuxt" target="_blank" rel="noopener noreferrer">Nuxt</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#svelte" target="_blank" rel="noopener noreferrer">Svelte</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#sveltekit" target="_blank" rel="noopener noreferrer">SvelteKit</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#solidjs" target="_blank" rel="noopener noreferrer">SolidJS</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#lit" target="_blank" rel="noopener noreferrer">Lit</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#nextjs" target="_blank" rel="noopener noreferrer">Next.js</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#astro" target="_blank" rel="noopener noreferrer">Astro</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#blazor" target="_blank" rel="noopener noreferrer">Blazor</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#server-rendered-templates" target="_blank" rel="noopener noreferrer">Server-rendered templates</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#wordpress" target="_blank" rel="noopener noreferrer">WordPress</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#alpinejs-and-htmx" target="_blank" rel="noopener noreferrer">Alpine.js and HTMX</a>

## Installation

```sh
npm i jb-color-picker
```

```js
import "jb-color-picker";
```

```html
<jb-color-picker></jb-color-picker>
```

### CDN

```html
<script src="https://unpkg.com/jb-color-picker/web-component/dist/jb-color-picker.umd.js"></script>
```

## API reference

### Attributes

| name | type | default | description |
| --- | --- | --- | --- |
| `color-space` | `"rgb" \| "oklch"` | none | Locks the picker to one color space and hides the switch. Omit it to let users switch spaces. [Demo](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--locked-rgb) |
| `alpha-disabled` | `boolean` | `false` | Hides the alpha slider and numeric alpha field. [Demo](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--without-alpha) |
| `disabled` | `boolean` | `false` | Disables the surface, sliders, space buttons, and numeric fields. [Demo](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--disabled) |

Set the initial color through the JavaScript `value` property rather than an HTML attribute.

### Properties

| name | type | readonly | description |
| --- | --- | --- | --- |
| `value` | `string \| JBColorPickerValue` when setting; `string` when reading | no | Accepts a supported CSS color string or typed color object. The getter returns a normalized CSS color string. [Demo](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--css-color-strings) |
| `valueObject` | `JBColorPickerValue` | yes | Returns a copy of the normalized typed value. [Demo](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--oklch) |
| `colorSpace` | `"rgb" \| "oklch" \| null` | no | Locks and converts the current value when set to a color space. Set `null` to show the space switch. |
| `alphaEnabled` | `boolean` | no | Shows or hides alpha controls. This is the inverse of the `alpha-disabled` attribute. |
| `disabled` | `boolean` | no | Enables or disables all interaction. |
| `elements` | `ColorPickerElements` | no | References to the rendered surface, sliders, fields, preview, switch, and output for advanced integrations. |

### Value types

```ts
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
```

RGB channels use `0..255`. OKLCH uses `0..1` lightness, `0..0.4` chroma, and `0..360` hue. Alpha uses `0..1`. Out-of-range object values are normalized.

Supported strings include modern or comma-separated `rgb()`/`rgba()`, `oklch()`, and 3-, 4-, 6-, or 8-digit hexadecimal colors. Invalid or unsupported strings are ignored.

```js
const picker = document.querySelector("jb-color-picker");

picker.value = { colorSpace: "oklch", l: 0.7, c: 0.15, h: 250, alpha: 1 };
picker.value = "oklch(70% 0.15 250 / 1)";
picker.value = "#3b66f5cc";
```

### Events

| event | description |
| --- | --- |
| `load` | Dispatched after the component connects and updates its initial view. |
| `init` | Dispatched immediately after `load` during connection. |
| `input` | Dispatched while a user changes the surface, slider, channel field, or color space. `event.detail` contains `value` and `valueObject`. |
| `change` | Dispatched when a user commits a change. `event.detail` contains `value` and `valueObject`. |

```js
picker.addEventListener("change", event => {
  console.log(event.detail.value);
  console.log(event.detail.valueObject);
});
```

Both value events bubble and cross shadow DOM boundaries.

## Color-space behavior

With no `color-space` attribute, users can switch between RGB and OKLCH. Switching converts the current color and emits both `input` and `change`.

Set `color-space="rgb"` or `color-space="oklch"` to lock the picker. Assigning `colorSpace = null` restores the switch. [See the locked RGB demo](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--locked-rgb).

## Alpha and disabled states

Use `alpha-disabled` in HTML or `alphaEnabled = false` in JavaScript to hide alpha controls. The current value keeps its alpha channel. [See the no-alpha demo](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--without-alpha).

Use `disabled` to prevent pointer and keyboard interaction. All internal buttons, sliders, and numeric fields are disabled as well. [See the disabled demo](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--disabled).

## CSS variables

The picker has no `size` attribute. Set `--jb-color-picker-width` to fit the surface to its context; the surface keeps a `4 / 3` aspect ratio. [See the size variants demo](https://javadbat.github.io/design-system/?path=/story/components-jbcolorpicker--size-variants).

| variable | default | description |
| --- | --- | --- |
| `--jb-color-picker-width` | `18rem` | Width of the picker. |
| `--jb-color-picker-background` | `var(--jb-surface, #fff)` | Picker background. |
| `--jb-color-picker-color` | `var(--jb-content-primary, #202124)` | Text color. |
| `--jb-color-picker-border-color` | `var(--jb-border, #d9dce1)` | Border and checker colors. |
| `--jb-color-picker-border-radius` | `0.75rem` | Outer border radius. |
| `--jb-color-picker-accent-color` | `var(--jb-primary, #3b66f5)` | Selected switch and slider accent color. |
| `--jb-color-picker-font-family` | `inherit` | Picker font family. |

```css
jb-color-picker {
  --jb-color-picker-width: 22rem;
  --jb-color-picker-background: #111827;
  --jb-color-picker-color: #f9fafb;
  --jb-color-picker-border-color: #374151;
  --jb-color-picker-accent-color: #a78bfa;
}
```

### CSS parts

| part | description |
| --- | --- |
| `wrapper` | Outer picker container. |
| `space-switch` | RGB/OKLCH switch container. |
| `space-button` | Each color-space button. |
| `color-surface` | Two-dimensional surface wrapper. |
| `surface-cursor` | Current point indicator. |
| `hue-slider` | Hue range input. |
| `alpha-slider` | Alpha range input. |
| `fields` | Numeric channel grid. |
| `field` | Each `jb-number-input` channel editor. |
| `result` | Selected-color result row. |
| `preview` | Selected-color swatch. |
| `value-text` | Normalized CSS color output. |

## Accessibility notes

- The host exposes a color-picker group label.
- The color surface is keyboard focusable; Arrow keys move by `0.01`, and Shift+Arrow moves by `0.1`.
- Hue, alpha, color-space, and numeric controls expose accessible labels.
- Disabled pickers remove the surface from the tab order and disable all internal form controls.

## Related docs

- See [`jb-color-picker/react`](https://github.com/javadbat/jb-color-picker/tree/main/react) for React usage.
- See [`jb-color-input`](https://github.com/javadbat/jb-color-input) for a complete form-input composition.
- See [all JB Design System components](https://javadbat.github.io/design-system/).
- Use the [contribution guide](https://github.com/javadbat/design-system/blob/main/docs/contribution-guide.md) to contribute.

## AI agent notes

- Import `jb-color-picker` once before rendering `<jb-color-picker>`.
- Set initial and controlled colors through the `.value` property; there is no observed `value` attribute.
- Read `.value` for normalized CSS text and `.valueObject` for typed channel data.
- Use `color-space` in HTML and `colorSpace` in JavaScript or React.
- Use `alpha-disabled` in HTML and `alphaEnabled` in JavaScript or React.
- The component is not form-associated; compose it with `jb-color-input` when form semantics are needed.
- The component has no `size` prop or attribute; use `--jb-color-picker-width`.
