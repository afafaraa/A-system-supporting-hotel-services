import {createTheme, PaletteMode, Theme} from "@mui/material";
import {lightPalette} from "./palette/lightPalette.ts";
import {darkPalette} from "./palette/darkPalette.ts";
import components from "./components.ts";


export const getTheme = (mode: PaletteMode): Theme => {
  return createTheme({
    palette: mode === 'light' ? lightPalette : darkPalette,
    components: components,
    typography: {
      fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    },
  });
}
