import {PaletteOptions} from "@mui/material";

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    light: 'hsl(256, 20%, 20%)',
    medium: '#242426',
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
    AVAILABLE: "hsl(200 60% 50%)",
    REQUESTED: "hsl(270 60% 50%)",
    ACTIVE:    "hsl(40  60% 50%)",
    COMPLETED: "hsl(120 60% 50%)",
    CANCELED:  "hsl(0    0% 40%)",
    text: "#000",
  },
    status: {
    CHECKED_IN: '#39D943',
    CHECKED_OUT: '#AAAAAA',
    UPCOMING: '#7545FB',
    NO_SHOW: '#FF0000',
  },
};
