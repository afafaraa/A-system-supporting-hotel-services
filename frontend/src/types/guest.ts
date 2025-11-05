import UserDetails from "./userDetails.ts";

export type Guest = UserDetails & {
    servicesCount: number;
    upcomingServicesCount: number;
    phone: string;
    status: 'Checked-in' | 'Checked-out' | 'Upcoming';
}

export type GuestStatus = "CHECKED_IN" | "CHECKED_OUT" | "UPCOMING";

export type GuestStatusFilter = "ALL" | GuestStatus;
