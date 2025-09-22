export type Guest = {
    id: number;
    name: string;
    surname: string;
    servicesCount: number;
    upcomingServicesCount: number;
    phone: string;
    email: string;
    status: 'Checked-in' | 'Checked-out' | 'Upcoming';
    guestData?: {
        roomNumber: string,
        checkInDate: Date,
        checkOutDate: Date,
        bill: number,
    }
}

export type GuestStatus = "CHECKED_IN" | "CHECKED_OUT" | "UPCOMING";

export type  GuestStatusFilter = "ALL" | GuestStatus;