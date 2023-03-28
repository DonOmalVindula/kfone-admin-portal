import { Role } from "../roles";

export interface Staff {
    id?: string;
    email: string;
    password: string;
    role: Role;
}