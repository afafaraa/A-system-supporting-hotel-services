import {PaletteOptions} from "@mui/material";

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  custom1: {
    main: '#FAF9FB',
    primary: '#FFFFFF',
    secondary: '#F5EEFE',
    contrastText: '',
  },
  custom2: {
    main: '#000000',
    primary: '#766F84',
    secondary: '#FFFFFF',
    contrastText: '',
  },
  custom3: {
    main: '#7545FB',
    primary: '#4E378F',
    secondary: '#ffffff',
    contrastText: '#E6DBF5',
  },
  calendar: {
    AVAILABLE: {primary: "hsl(200 60% 70%)", background: "hsl(200 60% 95%)"},
    REQUESTED: {primary: "hsl(268 80% 70%)", background: "hsl(268 80% 93%)"},
    ACTIVE: {primary: "hsl(183 40% 60%)", background: "hsl(183 60% 93%)"},
    COMPLETED: {primary: "hsl(122 40% 60%)", background: "hsl(122 60% 93%)"},
    CANCELED: {primary: "hsl(200 10% 30%)", background: "hsl(200 10% 90%)"},
  },
};
