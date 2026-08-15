"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";
import { useEvent } from "jb-core/react";
import "jb-color-picker";
import type { ColorPickerChangeEvent, ColorSpace, JBColorPickerValue, JBColorPickerWebComponent } from "jb-color-picker";
import type { JBElementStandardProps } from "jb-core/react";
import "./module-declaration.js";

export type JBColorPickerProps = JBElementStandardProps<JBColorPickerWebComponent, "value" | "colorSpace" | "alphaEnabled" | "disabled" | "onInput" | "onChange"> & {
  value?: JBColorPickerValue;
  colorSpace?: ColorSpace;
  alphaEnabled?: boolean;
  disabled?: boolean;
  onInput?: (event: ColorPickerChangeEvent) => void;
  onChange?: (event: ColorPickerChangeEvent) => void;
};

export const JBColorPicker = React.forwardRef<JBColorPickerWebComponent, JBColorPickerProps>((props, ref) => {
  const element = useRef<JBColorPickerWebComponent>(null);
  useImperativeHandle(ref, () => element.current!, []);
  const { value, colorSpace, alphaEnabled, disabled, onInput, onChange, ...otherProps } = props;

  useEffect(() => {
    if (element.current && value !== undefined) element.current.value = value;
  }, [value]);
  useEffect(() => {
    if (element.current && colorSpace !== undefined) element.current.colorSpace = colorSpace;
  }, [colorSpace]);
  useEffect(() => {
    if (element.current && alphaEnabled !== undefined) element.current.alphaEnabled = alphaEnabled;
  }, [alphaEnabled]);
  useEffect(() => {
    if (element.current && disabled !== undefined) element.current.disabled = disabled;
  }, [disabled]);
  useEvent(element, "input", onInput);
  useEvent(element, "change", onChange);

  return <jb-color-picker ref={element} {...otherProps}></jb-color-picker>;
});

JBColorPicker.displayName = "JBColorPicker";
