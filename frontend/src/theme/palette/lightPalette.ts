import {PaletteOptions} from "@mui/material";

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    light: 'hsl(256, 90%, 96%)',
    medium: 'hsl(256, 80%, 92%)',
    main: 'hsl(256, 80%, 60%)',
    dark: 'hsl(256, 50%, 40%)',
    contrastText: 'hsl(0, 0%, 95%)',
    border: 'rgba(0,0,0,0.25)'
  },
  secondary: {
    main: '#FFE921'
  },
  text: {
    primary: 'rgba(0,0,0,1)',
    secondary: 'rgba(118,111,132,1)',
  },
  background: {
    default: 'hsl(256, 20%, 95%)',
    paper: 'hsl(256, 20%, 98%)',
  },
  action: {
    active: 'rgba(0, 0, 0, 0.75)',
  },
  calendar: {
    AVAILABLE: {primary: "hsl(200 60% 70%)", background: "hsl(200 60% 95%)"},
    REQUESTED: {primary: "hsl(268 80% 70%)", background: "hsl(268 80% 93%)"},
    ACTIVE: {primary: "hsl(183 40% 60%)", background: "hsl(183 60% 93%)"},
    COMPLETED: {primary: "hsl(122 40% 60%)", background: "hsl(122 60% 93%)"},
    CANCELED: {primary: "hsl(200 10% 30%)", background: "hsl(200 10% 90%)"},
  },
};
