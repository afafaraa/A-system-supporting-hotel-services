
interface UserDetails { // corresponds to UserEntity
  id: string,
  email: string,
  employeeData: EmployeeData | null,
  guestData: GuestData | null,
  name: string,
  surname: string,
  active: boolean,
}

interface EmployeeData {
  department: string,
  sectors: string[],
  hireDate: string | Date,
}

interface GuestData {
  checkOutDate: string,
  currentReservation: {
    id: string,
    roomNumber: string,
    guestsCount: number,
    checkIn: string | Date,
    checkOut: string | Date,
    reservationPrice: number,
    paid: boolean,
    specialRequests?: string,
    status: 'REQUESTED' | 'CONFIRMED' | 'CANCELED' | 'REJECTED' | 'COMPLETED' | 'CHECKED_IN',
  },
  bill: number,
}

export default UserDetails;
