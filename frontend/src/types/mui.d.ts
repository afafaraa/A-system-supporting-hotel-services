import '@mui/material/styles';

declare module '@mui/material/styles' {

  type CalendarColors = {primary: string, background: string};

  interface Palette {
    //custom1: SimplePaletteColorOptions;
    calendar: Record<OrderStatus, CalendarColors>;
  }

  interface PaletteOptions {
    //custom1?: Partial<SimplePaletteColorOptions>;
    calendar?: Palette["calendar"];
  }
}
