import UserDetails from "./userDetails.ts";
import { Service } from "./service.ts";

export type Guest = UserDetails & {
}

export type GuestDetails = UserDetails & {
    guest: Guest;
    upcomingServices: Service[];
    completedServices: Service[];
    cancelledServices: Service[];
}

export type GuestStatus = "CHECKED_IN" | "CHECKED_OUT" | "UPCOMING" | "REQUESTED" | "CONFIRMED";

export type GuestStatusFilter = "ALL" | GuestStatus;
