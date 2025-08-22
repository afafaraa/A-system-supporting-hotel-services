import {IconButton, useTheme} from "@mui/material";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import {useContext} from "react";
import {PaletteContext} from "../../context/PaletteContext.ts";

function ThemeSwitcher() {
  const theme = useTheme();
  const { setPalette } = useContext(PaletteContext);
  const isLight = theme.palette.mode === "light";

  return (
    <IconButton onClick={() => setPalette(isLight ? "dark" : "light")}>
      {isLight ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
    </IconButton>
  );
}

export default ThemeSwitcher;
