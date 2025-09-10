import {PaletteOptions} from "@mui/material";

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    light: 'hsl(256, 90%, 96%)',
    medium: '#F5EEFE',
    main: 'hsl(256, 80%, 60%)',
    dark: 'hsl(256, 50%, 40%)',
    contrastText: 'hsl(0, 0%, 95%)',
    border: 'rgba(0, 0, 0, 0.25)'
  },
  secondary: {
    main: '#FFE921'
  },
  background: {
    default: 'hsl(256, 20%, 95%)',
    paper: 'hsl(256, 20%, 98%)',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(118, 111, 132, 1)',
  },
  action: {
    active: 'rgba(0, 0, 0, 0.75)',
  },
  calendar: {
    AVAILABLE: "hsl(200 60% 60%)",
    REQUESTED: "hsl(270 60% 60%)",
    ACTIVE:    "hsl(40  60% 60%)",
    COMPLETED: "hsl(120 60% 60%)",
    CANCELED:  "hsl(0    0% 40%)",
    text: "#fff",
  },
};
