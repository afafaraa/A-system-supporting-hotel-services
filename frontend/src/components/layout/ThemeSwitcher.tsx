import {IconButton, useTheme} from "@mui/material";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import {useDispatch} from "react-redux";
import {setTheme} from "../../redux/slices/themeSlice.ts";

function ThemeSwitcher() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const isLight = theme.palette.mode === "light";

  return (
    <IconButton onClick={() => dispatch(setTheme(isLight ? "dark" : "light"))}>
      {isLight ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
    </IconButton>
  );
}

export default ThemeSwitcher;
