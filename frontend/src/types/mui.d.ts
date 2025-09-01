import '@mui/material/styles';

declare module '@mui/material/styles' {

  type CalendarColors = {primary: string, background: string};

  interface Palette {
    calendar: Record<OrderStatus, CalendarColors>;
  }

  interface PaletteOptions {
    calendar?: Palette["calendar"];
  }

  interface PaletteColor {
    medium: string,
    border: string,
  }

  interface SimplePaletteColorOptions {
    medium?: string
    border?: string;
  }
}
