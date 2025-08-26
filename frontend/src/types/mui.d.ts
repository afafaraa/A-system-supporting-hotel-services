import '@mui/material/styles';

declare module '@mui/material/styles' {

  interface TypeBackground {
    shadow: string;
  }

  type CalendarColors = {primary: string, background: string};

  interface Palette {
    //custom1: SimplePaletteColorOptions;
    calendar: Record<OrderStatus, CalendarColors>;
  }

  interface PaletteOptions {
    //custom1?: Partial<SimplePaletteColorOptions>;
    calendar?: Palette["calendar"];
  }

  interface PaletteColor {
    medium: string,
  }

  interface SimplePaletteColorOptions {
    medium?: string
  }
}
