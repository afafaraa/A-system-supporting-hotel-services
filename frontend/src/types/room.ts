export type Room = {
  id: string;
  type: 'standard' | 'deluxe' | 'exclusive';
  price: number;
  status: string;
  description: string;
  guestsTotal: number;
  amenities: Amenity[];
};

type Amenity = {
  key: string;
  label: string;
}

export type RoomStatus = 'booked' | 'open' | 'pending' | 'outOfService';