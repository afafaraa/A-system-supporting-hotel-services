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

export type Reservation = {
    id: number;
    room: Room;
    startDate: string;
    endDate: string;
    numberOfGuests: number;
    totalPrice: number;
    status: 'Confirmed' | 'Pending' | 'Cancelled';
};
