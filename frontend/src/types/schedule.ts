export interface Schedule {
  id: string,
  serviceId: string,
  title: string | undefined,
  date: Date,
  duration: number | undefined,
  weekday: string,
  guestName: string | undefined,
  room: string | undefined,
  orderTime: string | undefined,
  price: number | undefined,
  status: OrderStatus,
}

export enum OrderStatus {
  available = "AVAILABLE",
  requested = "REQUESTED",
  active = "ACTIVE",
  completed = "COMPLETED",
  canceled = "CANCELED",
}
