import '@mui/material/styles';
import { GuestStatus } from './guest';

declare module '@mui/material/styles' {

  interface Palette {
    calendar: Record<OrderStatus, string> & {text: string};
    status: Record<GuestStatus, string>;
    custom: CustomColors;
  }

  interface PaletteOptions {
    calendar?: Palette["calendar"];
    status?: Palette["status"];
    custom?: CustomColors;
  }

  interface PaletteColor {
    medium: string,
  }

  interface SimplePaletteColorOptions {
    medium?: string;
  }

  interface CustomColors {
    sidebarButtonBg: string;
    sidebarButtonSelectedBg: string;
  }
}
