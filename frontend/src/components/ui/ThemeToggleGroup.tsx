import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {useTheme} from "@mui/material";
import {MouseEvent, useContext} from "react";
import {PaletteContext} from "../../context/PaletteContext.ts";
import {PaletteMode} from "@mui/material";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import {useTranslation} from "react-i18next";

function ThemeToggleGroup() {
  const {t} = useTranslation();
  const theme = useTheme();
  const {setPalette} = useContext(PaletteContext);

  const handleTheme = (
    _event: MouseEvent<HTMLElement>,
    newTheme: PaletteMode | null,
  ) => {
    if (newTheme !== null) setPalette(newTheme);
  };

  return (
    <ToggleButtonGroup
      size="small"
      value={theme.palette.mode}
      exclusive
      onChange={handleTheme}
      aria-label="page theme"
    >
      <ToggleButton value="dark" aria-label="dark theme" sx={{gap: 1, px: 3, textTransform: "none"}}>
        <DarkModeOutlinedIcon /> {t("pages.profile.dark")}
      </ToggleButton>
      <ToggleButton value="light" aria-label="light theme" sx={{gap: 1, px: 3, textTransform: "none"}}>
        <LightModeOutlinedIcon /> {t("pages.profile.light")}
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default ThemeToggleGroup;
