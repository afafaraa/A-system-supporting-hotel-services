export type Room = {
  number: string;
  type: 'standard' | 'deluxe' | 'exclusive';
  pricePerNight: number;
  status: string;
  standard: RoomStandard;
  description: string;
  capacity: number;
  amenities: string[];
};

export type RoomStandard = "Budget" | "Standard" | "Deluxe" | "Exclusive Suite";

export type ReservationGuest = {
  id: number;
  room: Room;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  reservationPrice: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
};
