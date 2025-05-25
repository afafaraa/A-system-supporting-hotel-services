export type Employee = {
    id: string;
    role: "EMPLOYEE" | "RECEPTIONIST" | "MANAGER";
    username: string;
    email: string;
    name: string;
    surname: string;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    occupation?: string;
};