export type Room = {
  id: string;
  type: 'standard' | 'deluxe' | 'exclusive';
  pricePerNight: number;
  status: string;
  standard: RoomStandard;
  description: string;
  capacity: number;
  amenities: string[];
};

export type RoomStandard = "Budget" | "Standard" | "Deluxe" | "Exclusive Suite";
