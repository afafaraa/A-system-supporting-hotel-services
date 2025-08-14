import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface CustomColor {
    main: string;
    primary: string;
    secondary: string;
    contrastText: string;
  }

  type CalendarColors = {primary: string, background: string};

  interface Palette {
    custom1: CustomColor;
    custom2: CustomColor;
    calendar: Record<OrderStatus, CalendarColors>;
  }

  interface PaletteOptions {
    custom1?: Partial<CustomColor>;
    custom2?: Partial<CustomColor>;
    calendar?: Palette["calendar"];
  }
}
