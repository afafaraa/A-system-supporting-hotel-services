import '@mui/material/styles';

declare module '@mui/material/styles' {

  interface Palette {
    calendar: Record<OrderStatus, string> & {text: string};
    status: Record<'CHECKED_IN' | 'CHECKED_OUT' | 'UPCOMING' | 'NO_SHOW', string>;
  }

  interface PaletteOptions {
    calendar?: Palette["calendar"];
    status?: Palette["status"];
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
