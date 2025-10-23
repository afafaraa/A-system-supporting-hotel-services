export interface Room {
  number: string;
  floor?: number;
  capacity: number;
  pricePerNight: number;
  standard: RoomStandard;
  description: string;
  amenities: Amenity[];
  roomStatus: RoomStatus;
};

export interface RoomStandard {
  id?: string;
  name: string;
  capacity: number;
  basePrice: number;
  description?: string;
}

type Amenity = {
  key: string;
  label: string;
}

export enum RoomAmenity {
  WIFI = "WIFI",
  TV = "TV",
  AIR_CONDITIONING = "AIR_CONDITIONING",
  MINI_BAR = "MINI_BAR",
  MINI_FRIDGE = "MINI_FRIDGE",
  SAFE = "SAFE",
  HAIR_DRYER = "HAIR_DRYER",
  IRON = "IRON",
  KITCHENETTE = "KITCHENETTE",
  BALCONY = "BALCONY",
  SEA_VIEW = "SEA_VIEW",
  PET_FRIENDLY = "PET_FRIENDLY"
}

export enum RoomStatus {
  AVAILABLE = "AVAILABLE",
  OUT_OF_SERVICE = "OUT_OF_SERVICE"
}
