export type Guest = {
    id: number;
    name: string;
    surname: string;
    checkInDate: string;
    checkOutDate: string;
    room: string;
    servicesCount: number;
    upcomingServicesCount: number;
    phone: string;
    bill: number;
    email: string;
    status: 'Checked-in' | 'Checked-out' | 'Upcoming';
}

export type  GuestStatusFilter = "ALL" | "CHECKED_IN" | "CHECKED_OUT" | "UPCOMING";