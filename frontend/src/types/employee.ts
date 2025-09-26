export type Employee = {
    id: string;
    role: Role;
    username: string;
    email: string;
    name: string;
    surname: string;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    employeeData?: {
        department?: Department;
        sectors?: Sector[];
    };
};

export type Role = "EMPLOYEE" | "RECEPTIONIST" | "MANAGER"

export type Department = "FOOD_AND_BEVERAGE" | "HOUSEKEEPING" | "RECEPTION" | "MAINTENANCE";

export type Sector = "BREAKFAST"  | "LUNCH"  | "DINNER"  | "ROOM_SERVICE"  | "SECURITY" | "SPA_AND_WELLNESS";