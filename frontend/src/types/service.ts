export type WeekdayHour = {
    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
    startHour: number;
    endHour: number;
}

export type Rating = {
    author: string;
    rating: number;
    comment: string;
};

export type Service = {
    id?: string;
    name: string;
    description?: string;
    price: number;
    type: "GENERAL_SERVICE" | "PLACE_RESERVATION";
    disabled: boolean;
    rating?: Rating[];
    duration: number;
    maxAvailable?: number;
    weekday: WeekdayHour[];
    image?: string;
}