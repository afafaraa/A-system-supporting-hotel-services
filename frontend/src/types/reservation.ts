import {RoomStandard} from "./room.ts";

interface Reservation {
  id: string;
  roomNumber: string;
  guestId: string;
  guestsCount: number;
  checkIn: string;
  checkOut: string;
  reservationPrice: number;
  paid: boolean;
  specialRequests?: string;
  status: string;
  blocksRoom: boolean;
  createdAt: string;
  rejectReason?: string;
  guestFullName?: string;
  guestEmail?: string;
  roomStandard: RoomStandard;
}

export default Reservation;
