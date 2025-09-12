import '@mui/material/styles';

declare module '@mui/material/styles' {

  interface Palette {
    calendar: Record<OrderStatus, string> & {text: string};
  }

  interface PaletteOptions {
    calendar?: Palette["calendar"];
  }

  interface PaletteColor {
    medium: string;
    border: string;
  }

  interface SimplePaletteColorOptions {
    medium?: string;
    border?: string;
  }
}
