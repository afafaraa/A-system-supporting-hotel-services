export interface Room {
  number: string;
  floor?: number;
  capacity: number;
  pricePerNight: number;
  standard: RoomStandard;
  description: string;
  amenities: string[];
  roomStatus: RoomStatus;
}

export interface RoomStandard {
  id?: string;
  name: string;
  capacity: number;
  basePrice: number;
  description?: string;
}

export enum RoomStatus {
  AVAILABLE = "AVAILABLE",
  OUT_OF_SERVICE = "OUT_OF_SERVICE"
}

export type ReservationGuest = {
  id: number;
  room: Room;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  reservationPrice: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  specialRequests?: string;
};
