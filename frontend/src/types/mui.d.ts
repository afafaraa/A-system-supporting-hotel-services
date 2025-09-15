import '@mui/material/styles';

declare module '@mui/material/styles' {

  type CalendarColors = {primary: string, background: string};

  interface Palette {
    calendar: Record<OrderStatus, CalendarColors>;
    status: Record<'CHECKED_IN' | 'CHECKED_OUT' | 'UPCOMING' | 'NO_SHOW', string>;
  }

  interface PaletteOptions {
    calendar?: Palette["calendar"];
    status?: Palette["status"];
  }

  interface PaletteColor {
    medium: string,
  }

  interface SimplePaletteColorOptions {
    medium?: string
  }
}
