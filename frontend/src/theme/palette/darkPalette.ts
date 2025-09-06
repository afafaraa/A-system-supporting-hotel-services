import {PaletteOptions} from "@mui/material";

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    light: 'hsl(256, 20%, 20%)',
    medium: 'hsl(256, 30%, 24%)',
    main: 'hsl(256, 80%, 60%)',
    dark: 'hsl(256, 50%, 40%)',
    contrastText: 'hsl(256, 95%, 95%)',
    border: 'rgba(146, 146, 146, 0.25)',
  },
  secondary: {
    main: '#FFE921'
  },
  background: {
    default: 'hsl(256, 8%, 10%)',
    paper: 'hsl(256, 8%, 14%)',
  },
  text: {
    primary: 'hsl(0, 0%, 95%)',
    secondary: 'rgba(140, 138, 144, 1)',
  },
  action: {
    active: 'hsl(0, 0%, 95%)',
  },
  calendar: {
    AVAILABLE: {primary: "hsl(200 60% 60%)", background: "#000"},
    REQUESTED: {primary: "hsl(270 60% 60%)", background: "#000"},
    ACTIVE:    {primary: "hsl(40  60% 60%)", background: "#000"},
    COMPLETED: {primary: "hsl(120 60% 60%)", background: "#000"},
    CANCELED:  {primary: "hsl(0    0% 40%)", background: "#000"},
  },
};
