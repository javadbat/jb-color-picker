import "jb-number-input";
import type { JBNumberInputWebComponent } from "jb-number-input";

export function renderHTML(): string {
  return /* html */ `
    <div class="picker" part="wrapper">
      <div class="space-switch" role="group" aria-label="Color space" part="space-switch">
        <button type="button" data-space="rgb" part="space-button">RGB</button>
        <button type="button" data-space="oklch" part="space-button">OKLCH</button>
      </div>
      <div class="surface-wrap" part="color-surface">
        <canvas class="surface" width="256" height="192" aria-label="Color field"></canvas>
        <span class="surface-cursor" aria-hidden="true" part="surface-cursor"></span>
      </div>
      <label class="slider-row hue-row">
        <span>Hue</span>
        <input class="hue" type="range" min="0" max="360" step="1" aria-label="Hue" part="hue-slider">
      </label>
      <label class="slider-row alpha-row">
        <span>Alpha</span>
        <span class="alpha-track">
          <input class="alpha" type="range" min="0" max="1" step="0.01" aria-label="Alpha" part="alpha-slider">
        </span>
      </label>
      <div class="fields" part="fields"></div>
      <div class="result" part="result">
        <span class="preview" aria-hidden="true" part="preview"></span>
        <output class="value-text" aria-live="polite" part="value-text"></output>
      </div>
    </div>
  `;
}

export function createPickerContent(styles: string): DocumentFragment {
  const template = document.createElement("template");
  template.innerHTML = `<style>${styles}</style>${renderHTML()}`;
  return template.content.cloneNode(true) as DocumentFragment;
}

export function createFieldElement(channel: string, onChange: (event: Event) => void): JBNumberInputWebComponent {
  const input = document.createElement("jb-number-input") as JBNumberInputWebComponent;
  input.className = "field";
  input.setAttribute("size", "xs");
  input.setAttribute("part", "field");
  input.dataset.channel = channel;
  input.addEventListener("change", onChange);
  return input;
}
