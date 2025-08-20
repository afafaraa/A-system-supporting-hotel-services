import {useEffect, useState} from "react";
import {getTheme} from "./theme/theme.ts";
import {PaletteMode, ThemeProvider} from "@mui/material";
import App from "./App.tsx";
import {PaletteContext} from "./context/PaletteContext.ts";

function safeGetInitialMode(): PaletteMode {
  const saved = localStorage.getItem("THEME") as PaletteMode | null;
  if (saved !== null) return saved;
  if (typeof window !== "undefined" && window.matchMedia)
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  return "light";
}

function ThemedApp() {
  const [paletteMode, setPaletteMode] = useState<PaletteMode>(() => safeGetInitialMode());
  const theme = getTheme(paletteMode);

  useEffect(() => {
    localStorage.setItem('THEME', paletteMode);
  }, [paletteMode]);

  return (
    <PaletteContext.Provider value={{ setPalette: setPaletteMode }}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </PaletteContext.Provider>
  );
}

export default ThemedApp;
