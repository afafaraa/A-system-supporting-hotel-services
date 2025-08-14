import {createTheme} from "@mui/material";
import {palette} from "../palette.ts";

export const lightTheme = createTheme({
  palette: palette.light,
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: palette.light.custom1.main,
        }
      }
    },
    LogInWrapper: {
      styleOverrides: {
        root: {
          backgroundColor: palette.light.custom1.primary,
          padding: '40px 30px',
          borderRadius: '25px',
          boxShadow: `0px 0px 15px -1px ${palette.light.custom3.contrastText}`,
        }
      }
    },
    LogInInput: {
      styleOverrides: {
        root: {
          border: 'none',
          backgroundColor: palette.light.custom1.secondary,
          padding: '8px 13px',
          borderRadius: '5px',
          fontSize: '12px',
          "&:focus": {
            // outline: `4px solid ${lightColors.primary(0.4)}`,
          },
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: palette.light.custom3.main,
          color: palette.light.custom3.secondary,
          fontWeight: "bold",
          textTransform: "none",
          "&:hover": { backgroundColor: "primary.light" }
        }
      }
    }
  }
});

export default lightTheme;
