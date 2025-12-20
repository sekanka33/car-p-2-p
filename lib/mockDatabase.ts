
import { User, Car, Booking, Transaction, UserRole, CarStatus, BookingStatus, GlobalPriceRules } from '../types';

const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@driveshare.com', role: UserRole.ADMIN, avatar: 'https://picsum.photos/seed/admin/100/100' },
  { id: 'u2', name: 'John Owner', email: 'john@owner.com', role: UserRole.OWNER, avatar: 'https://picsum.photos/seed/owner/100/100' },
  { id: 'u3', name: 'Alice Renter', email: 'alice@renter.com', role: UserRole.RENTER, avatar: 'https://picsum.photos/seed/renter/100/100' },
];

const INITIAL_CARS: Car[] = [
  {
    id: 'c1',
    ownerId: 'u2',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    transmission: 'Automatic',
    seats: 5,
    mileage: 12000,
    description: 'Electric elegance for a smooth ride around the city.',
    basePrice: 120,
    images: ['https://picsum.photos/seed/tesla/800/600', 'https://picsum.photos/seed/tesla2/800/600'],
    documents: ['doc1.pdf'],
    status: CarStatus.APPROVED,
    location: 'San Francisco',
    type: 'Sedan'
  },
  {
    id: 'c2',
    ownerId: 'u2',
    make: 'Porsche',
    model: '911 Carrera',
    year: 2022,
    transmission: 'Automatic',
    seats: 2,
    mileage: 5000,
    description: 'The ultimate sports car experience.',
    basePrice: 350,
    images: ['https://picsum.photos/seed/porsche/800/600'],
    documents: ['doc2.pdf'],
    status: CarStatus.APPROVED,
    location: 'Los Angeles',
    type: 'Sports'
  },
  {
    id: 'c3',
    ownerId: 'u2',
    make: 'Land Rover',
    model: 'Defender',
    year: 2021,
    transmission: 'Automatic',
    seats: 7,
    mileage: 30000,
    description: 'Rugged capability for any adventure.',
    basePrice: 200,
    images: ['https://picsum.photos/seed/defender/800/600'],
    documents: ['doc3.pdf'],
    status: CarStatus.PENDING,
    location: 'Denver',
    type: 'SUV'
  }
];

const DB_KEY = 'driveshare_db_v1';

class MockDatabase {
  private data: {
    users: User[];
    cars: Car[];
    bookings: Booking[];
    transactions: Transaction[];
    rules: GlobalPriceRules;
  };

  constructor() {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) {
      this.data = JSON.parse(saved);
    } else {
      this.data = {
        users: INITIAL_USERS,
        cars: INITIAL_CARS,
        bookings: [],
        transactions: [],
        rules: {
          weekendMultiplier: 1.2,
          seasonalMultiplier: 1.1,
          depositFee: 500
        }
      };
      this.save();
    }
  }

  private save() {
    localStorage.setItem(DB_KEY, JSON.stringify(this.data));
  }

  getUsers() { return this.data.users; }
  getCars() { return this.data.cars; }
  getBookings() { return this.data.bookings; }
  getTransactions() { return this.data.transactions; }
  getRules() { return this.data.rules; }

  updateRules(rules: GlobalPriceRules) {
    this.data.rules = rules;
    this.save();
  }

  addCar(car: Car) {
    this.data.cars.push(car);
    this.save();
  }

  updateCarStatus(carId: string, status: CarStatus) {
    const car = this.data.cars.find(c => c.id === carId);
    if (car) {
      car.status = status;
      this.save();
    }
  }

  addBooking(booking: Booking) {
    this.data.bookings.push(booking);
    this.save();
  }

  addTransaction(tx: Transaction) {
    this.data.transactions.push(tx);
    this.save();
  }

  updatePayoutStatus(txId: string, status: 'paid') {
    const tx = this.data.transactions.find(t => t.id === txId);
    if (tx) {
      tx.payoutStatus = status;
      this.save();
    }
  }
}

export const db = new MockDatabase();
