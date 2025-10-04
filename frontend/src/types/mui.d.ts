import '@mui/material/styles';
import { GuestStatus } from './guest';

declare module '@mui/material/styles' {

  interface Palette {
    calendar: Record<OrderStatus, string> & {text: string};
    status: Record<GuestStatus, string>;
  }

  interface PaletteOptions {
    calendar?: Palette["calendar"];
    status?: Palette["status"];
  }

  interface PaletteColor {
    medium: string,
  }

  interface SimplePaletteColorOptions {
    medium?: string;
  }
}
