import type { JBColorPickerWebComponent } from "jb-color-picker";
import type React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "jb-color-picker": JBColorPickerType;
    }
    interface JBColorPickerType extends React.DetailedHTMLProps<React.HTMLAttributes<JBColorPickerWebComponent>, JBColorPickerWebComponent> {
      "color-space"?: "rgb" | "oklch";
      "alpha-disabled"?: string;
      disabled?: string;
    }
  }
}
