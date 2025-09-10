import {PaletteOptions} from "@mui/material";

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    light: 'hsl(256, 20%, 20%)',
    medium: '#242426',
    main: 'hsl(256, 80%, 60%)',
    dark: 'hsl(256, 50%, 40%)',
    contrastText: 'hsl(256, 95%, 95%)',
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
    secondary: '#766F84'
  },
  action: {
    active: 'hsl(0, 0%, 95%)',
  },
  calendar: {
    AVAILABLE: {primary: "hsl(200 60% 70%)", background: "hsl(200 60% 95%)"},
    REQUESTED: {primary: "hsl(268 80% 70%)", background: "hsl(268 80% 93%)"},
    ACTIVE: {primary: "hsl(183 40% 60%)", background: "hsl(183 60% 93%)"},
    COMPLETED: {primary: "hsl(122 40% 60%)", background: "hsl(122 60% 93%)"},
    CANCELED: {primary: "hsl(200 10% 30%)", background: "hsl(200 10% 90%)"},
  },
};
