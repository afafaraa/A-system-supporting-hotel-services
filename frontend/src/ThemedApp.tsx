import {useEffect, useState} from "react";
import {getTheme} from "./theme/theme.ts";
import {PaletteMode, ThemeProvider} from "@mui/material";
import App from "./App.tsx";
import {PaletteContext} from "./context/PaletteContext.ts";

function getInitialMode(): PaletteMode {
  return (document.documentElement.getAttribute("data-theme") ||
    localStorage.getItem("THEME") || "light") as PaletteMode;
}

function ThemedApp() {
  const [paletteMode, setPaletteMode] = useState<PaletteMode>(() => getInitialMode());
  const theme = getTheme(paletteMode);

  useEffect(() => {
    localStorage.setItem('THEME', paletteMode);
    document.documentElement.setAttribute('data-theme', paletteMode);
    document.documentElement.style.backgroundColor = theme.palette.background.default;
  }, [paletteMode, theme]);

  return (
    <PaletteContext.Provider value={{ setPalette: setPaletteMode }}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </PaletteContext.Provider>
  );
}

export default ThemedApp;
