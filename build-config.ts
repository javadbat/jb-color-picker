import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-color-picker",
    path: "./web-component/lib/jb-color-picker.ts",
    outputPath: "./web-component/dist/jb-color-picker.js",
    tsConfigPath: "./web-component/tsconfig.json",
    external: ["jb-core/theme", "jb-number-input"],
    globals: { "jb-core/theme": "JBCoreTheme", "jb-number-input": "JBNumberInput" },
    umdName: "JBColorPicker",
  },
];

export const reactComponentList: ReactComponentBuildConfig[] = [
  {
    name: "jb-color-picker-react",
    path: "./react/lib/JBColorPicker.tsx",
    outputPath: "./react/dist/JBColorPicker.js",
    external: ["jb-color-picker", "react"],
    globals: { react: "React", "jb-color-picker": "JBColorPicker" },
    umdName: "JBColorPickerReact",
    dir: "./react",
  },
];
