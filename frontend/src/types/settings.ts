export interface AdministrationSettings {
    id?: string;
    hotelName: string;
    address: string;
    phoneNumber: string;
    email: string;
    timezone: string;
    defaultLanguage: string;
}

export type TimezoneOption = {
    zoneId: string;
    displayName: string;
}

export type LanguageOption = {
    code: string;
    displayName: string;
}