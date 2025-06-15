import {createTheme} from "@mui/material";
import {cyan, indigo} from "@mui/material/colors";

declare module '@mui/material/styles' {
  interface TypeBackground {
    primaryLight: string;
  }
}

export {}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: cyan,
    secondary: indigo,
    background: {
      default: '#f0f0f0',
      paper: '#fff',
      primaryLight: cyan[100],
    },
    text: {
      primary: '#333',
      secondary: '#666',
      disabled: '#999',
    },
  },
  components: {
    MuiTooltip: {
      defaultProps: {
        slotProps: {
          popper: { modifiers: [{name: 'offset', options: {offset: [0, -10]}}], },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          width: '100%',
        },
      },
    },
  },
});


export const mainActionButtonSx = {
  backgroundColor: "primary.dark",
  color: "white",
  fontWeight: "bold",
  textTransform: "none",
  "&:hover": { backgroundColor: "primary.light" }
};

export default theme;
