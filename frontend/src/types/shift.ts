export type Shift = {
    id: string;
    weekday: string;
    startHour: number;
    endHour: number;
    title: string;
    guest: string;
    status: string;
    serviceId: string;
    orderTime?: string;
  };