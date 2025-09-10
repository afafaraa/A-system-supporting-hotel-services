export interface Schedule {
  id: string,
  serviceId: string,
  title: string | undefined,
  date: string | Date,
  duration: number | undefined,
  weekday: string,
  guestName: string | undefined,
  room: string | undefined,
  orderTime: string | undefined,
  price: number | undefined,
  status: OrderStatus,
}

export enum OrderStatus {
  AVAILABLE = "AVAILABLE",
  REQUESTED = "REQUESTED",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}
