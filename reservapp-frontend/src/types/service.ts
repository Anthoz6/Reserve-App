import { User } from "./user";

export interface Service {
    id: number;
    title: string;
    description: string;
    price: number;
    provider: User;
}