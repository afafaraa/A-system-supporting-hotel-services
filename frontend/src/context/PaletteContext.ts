import {createContext} from "react";
import {PaletteMode} from "@mui/material";

export const PaletteContext = createContext<{setPalette: (mode: PaletteMode) => void}>({
  setPalette: () => {},
});
