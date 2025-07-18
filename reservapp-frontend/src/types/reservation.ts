// src/types/reservation.ts
import { User } from './user';
import { Service } from './service';

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export interface Reservation {
  id: number;
  customer?: User;
  provider?: User;
  service?: Service;
  customer_name?: string;
  provider_name?: string;
  service_title?: string;
  date: string; // ISO
  time: string; // HH:MM:SS
  status: ReservationStatus;
}
