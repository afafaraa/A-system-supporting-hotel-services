import {PaletteOptions} from "@mui/material";

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    light: '#9375f3',         // custom3.secondary
    main: '#7545FB',          // custom3.main
    dark: '#4E378F',          // custom3.primary
    contrastText: '#090113',  // custom3.contrastText
  },
  background: {
    default: '#1a1a1e',
    paper: '#121214',
    shadow: '#150a24',
  },
  action: {
    active: '#eee',
  },
  calendar: {
    AVAILABLE: {primary: "hsl(200 60% 70%)", background: "hsl(200 60% 95%)"},
    REQUESTED: {primary: "hsl(268 80% 70%)", background: "hsl(268 80% 93%)"},
    ACTIVE: {primary: "hsl(183 40% 60%)", background: "hsl(183 60% 93%)"},
    COMPLETED: {primary: "hsl(122 40% 60%)", background: "hsl(122 60% 93%)"},
    CANCELED: {primary: "hsl(200 10% 30%)", background: "hsl(200 10% 90%)"},
  },
};
