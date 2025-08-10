import {createTheme} from "@mui/material";
import {cyan, indigo} from "@mui/material/colors";
import {OrderStatus} from "../types/schedule.ts";
import {pallete} from "./pallete.ts";

declare module '@mui/material/styles' {
  interface TypeBackground {
    primaryLight: string;
  }

  type CalendarColors = {primary: string, background: string};

  interface Palette {
    calendar: Record<OrderStatus, CalendarColors>
  }

  interface PaletteOptions {
    calendar?: Palette["calendar"];
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
    calendar: {
      AVAILABLE: {primary: "hsl(200 60% 70%)", background: "hsl(200 60% 95%)"},
      REQUESTED: {primary: "hsl(268 80% 70%)", background: "hsl(268 80% 93%)"},
      ACTIVE: {primary: "hsl(183 40% 60%)", background: "hsl(183 60% 93%)"},
      COMPLETED: {primary: "hsl(122 40% 60%)", background: "hsl(122 60% 93%)"},
      CANCELED: {primary: "hsl(200 10% 30%)", background: "hsl(200 10% 90%)"},
    }
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

export const lightTheme = createTheme({
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: pallete.light.background.primary,
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          backgroundColor: pallete.light.background.secondary,
        }
      }
    }
  }
})

export default theme;
