
export enum UserRole {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  RENTER = 'RENTER'
}

export enum CarStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Car {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  transmission: 'Automatic' | 'Manual';
  seats: number;
  mileage: number;
  description: string;
  basePrice: number;
  images: string[];
  documents: string[];
  status: CarStatus;
  location: string;
  type: string; // Sedan, SUV, etc
}

export interface Booking {
  id: string;
  renterId: string;
  carId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface Transaction {
  id: string;
  bookingId: string;
  amount: number;
  paymentStatus: 'success' | 'failed' | 'pending';
  payoutStatus: 'pending' | 'paid';
}

export interface GlobalPriceRules {
  weekendMultiplier: number;
  seasonalMultiplier: number;
  depositFee: number;
}
