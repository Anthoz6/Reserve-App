import { User } from "./user";
import { Service } from "./service";

export enum ReservationStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED"
}

export interface Reservation {
    id: number;
    customer: User;
    provider: User;
    service: Service;
    date: string; // ISO
    time: string; // HH:MM:SS
    status: ReservationStatus;
}
