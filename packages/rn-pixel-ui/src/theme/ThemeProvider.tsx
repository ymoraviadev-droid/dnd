import React, { createContext, useContext, useMemo } from "react";
import { pixelTheme as defaultTheme } from "./theme";
import { PixelTheme } from "../types/PixelTheme";

const ThemeCtx = createContext<PixelTheme>(defaultTheme);

export const usePixelTheme = () => useContext(ThemeCtx);

export const PixelThemeProvider: React.FC<
  React.PropsWithChildren<{ theme?: Partial<PixelTheme> }>
> = ({ children, theme }) => {
  // shallow-merge is enough because we keep top-level objects stable
  const merged = useMemo<PixelTheme>(() => ({ ...defaultTheme, ...theme }), [theme]);
  return <ThemeCtx.Provider value={merged}>{children}</ThemeCtx.Provider>;
};
