import React$1, { DetailedHTMLProps } from "react";
import { ColorPickerChangeEvent, ColorSpace, JBColorPickerValue, JBColorPickerWebComponent } from "jb-color-picker";

//#region modules/jb-core/react/dist/index.d.ts
//#endregion
//#region modules/jb-core/react/lib/types/index.d.ts
type ReactElementStandardProps<TElement = HTMLElement> = DetailedHTMLProps<React.HTMLAttributes<TElement>, TElement>;
type JBElementStandardProps<TElement = HTMLElement, TOmit extends string = never> = Omit<ReactElementStandardProps<TElement>, 'ref' | 'key' | TOmit>; //#endregion
//#endregion
//#region modules/jb-color-picker/react/lib/module-declaration.d.ts
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "jb-color-picker": JBColorPickerType;
    }
    interface JBColorPickerType extends React$1.DetailedHTMLProps<React$1.HTMLAttributes<JBColorPickerWebComponent>, JBColorPickerWebComponent> {
      "color-space"?: "rgb" | "oklch";
      "alpha-disabled"?: string;
      disabled?: string;
    }
  }
}
//#endregion
//#region modules/jb-color-picker/react/lib/JBColorPicker.d.ts
type JBColorPickerProps = JBElementStandardProps<JBColorPickerWebComponent, "value" | "colorSpace" | "alphaEnabled" | "disabled" | "onInput" | "onChange"> & {
  value?: JBColorPickerValue;
  colorSpace?: ColorSpace;
  alphaEnabled?: boolean;
  disabled?: boolean;
  onInput?: (event: ColorPickerChangeEvent) => void;
  onChange?: (event: ColorPickerChangeEvent) => void;
};
declare const JBColorPicker: React$1.ForwardRefExoticComponent<JBElementStandardProps<JBColorPickerWebComponent, "onChange" | "onInput" | "value" | "colorSpace" | "alphaEnabled" | "disabled"> & {
  value?: JBColorPickerValue;
  colorSpace?: ColorSpace;
  alphaEnabled?: boolean;
  disabled?: boolean;
  onInput?: (event: ColorPickerChangeEvent) => void;
  onChange?: (event: ColorPickerChangeEvent) => void;
} & React$1.RefAttributes<JBColorPickerWebComponent>>;
//#endregion
export { JBColorPicker, JBColorPickerProps };