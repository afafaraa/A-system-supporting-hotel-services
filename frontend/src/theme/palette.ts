import { Palette as MuiPalette, PaletteOptions as MuiPaletteOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  interface CustomColor {
    main: string;
    primary: string;
    secondary: string;
    contrastText: string;
  }

  interface Palette extends MuiPalette {
    custom1: CustomColor;
    custom2: CustomColor;
    custom3: CustomColor;
  }

  interface PaletteOptions extends MuiPaletteOptions {
    custom1?: Partial<CustomColor>;
    custom2?: Partial<CustomColor>;
    custom3?: Partial<CustomColor>;
  }
}
export const palette = {
  light: {
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
  },
};
