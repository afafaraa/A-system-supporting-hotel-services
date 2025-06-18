import {OrderStatus} from "./schedule.ts";

export type Shift = {
    id: string;
    weekday: string;
    startHour: number;
    endHour: number;
    title: string;
    guest: string;
    status: OrderStatus;
    serviceId: string;
    orderTime?: string;
  };