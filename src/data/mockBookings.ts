export interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  totalAmount: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  bookedAt: string;
}

export const mockBookings: Booking[] = [
  {
    id: 'BK001',
    propertyId: '3',
    propertyName: 'Urban Penthouse',
    propertyImage: '/modern_penthouse_product_1777309808415.png',
    guestName: 'Alex Johnson',
    guestEmail: 'alex.johnson@email.com',
    checkIn: 'May 5, 2026',
    checkOut: 'May 10, 2026',
    nights: 5,
    adults: 2,
    children: 0,
    pricePerNight: 12000,
    cleaningFee: 1800,
    serviceFee: 12000,
    totalAmount: 73800,
    status: 'CONFIRMED',
    bookedAt: 'Apr 29, 2026'
  },
  {
    id: 'BK002',
    propertyId: '7',
    propertyName: 'Neo-Tokyo High-Rise',
    propertyImage: '/tokyo_studio_1777320000002_1777320809213.png',
    guestName: 'Priya Sharma',
    guestEmail: 'priya.sharma@email.com',
    checkIn: 'Jun 1, 2026',
    checkOut: 'Jun 8, 2026',
    nights: 7,
    adults: 1,
    children: 0,
    pricePerNight: 8500,
    cleaningFee: 1275,
    serviceFee: 5950,
    totalAmount: 66725,
    status: 'PENDING',
    bookedAt: 'Apr 30, 2026'
  },
  {
    id: 'BK003',
    propertyId: '10',
    propertyName: 'Eiffel View Apartment',
    propertyImage: '/modern_penthouse_product_1777309808415.png',
    guestName: 'Marcus Webb',
    guestEmail: 'marcus.webb@email.com',
    checkIn: 'May 20, 2026',
    checkOut: 'May 25, 2026',
    nights: 5,
    adults: 2,
    children: 1,
    pricePerNight: 9500,
    cleaningFee: 1425,
    serviceFee: 11375,
    totalAmount: 60300,
    status: 'CONFIRMED',
    bookedAt: 'Apr 28, 2026'
  },
  {
    id: 'BK004',
    propertyId: '17',
    propertyName: 'Seminyak Infinity Villa',
    propertyImage: '/alpine_chalet_1777320000001_1777320791554.png',
    guestName: 'Chloe Dupont',
    guestEmail: 'chloe.dupont@email.com',
    checkIn: 'Jul 15, 2026',
    checkOut: 'Jul 22, 2026',
    nights: 7,
    adults: 4,
    children: 2,
    pricePerNight: 2500,
    cleaningFee: 375,
    serviceFee: 4375,
    totalAmount: 22250,
    status: 'CONFIRMED',
    bookedAt: 'Apr 27, 2026'
  },
  {
    id: 'BK005',
    propertyId: '12',
    propertyName: 'Marina Bay Sky Residence',
    propertyImage: '/contemporary_mansion_product_1777309826607.png',
    guestName: 'Ryan Okafor',
    guestEmail: 'ryan.okafor@email.com',
    checkIn: 'May 10, 2026',
    checkOut: 'May 14, 2026',
    nights: 4,
    adults: 2,
    children: 0,
    pricePerNight: 18000,
    cleaningFee: 2700,
    serviceFee: 14400,
    totalAmount: 89100,
    status: 'CANCELLED',
    bookedAt: 'Apr 25, 2026'
  },
  {
    id: 'BK006',
    propertyId: '3',
    propertyName: 'Urban Penthouse',
    propertyImage: '/modern_penthouse_product_1777309808415.png',
    guestName: 'Sophia Lee',
    guestEmail: 'sophia.lee@email.com',
    checkIn: 'Jun 20, 2026',
    checkOut: 'Jun 27, 2026',
    nights: 7,
    adults: 2,
    children: 1,
    pricePerNight: 12000,
    cleaningFee: 1800,
    serviceFee: 12600,
    totalAmount: 102600,
    status: 'PENDING',
    bookedAt: 'Apr 30, 2026'
  },
  {
    id: 'BK007',
    propertyId: '19',
    propertyName: 'Canary Wharf Commercial Tower',
    propertyImage: '/silicon_hub_1777320000004_1777320844703.png',
    guestName: 'Haruto Nakamura',
    guestEmail: 'haruto@email.com',
    checkIn: 'May 1, 2026',
    checkOut: 'May 31, 2026',
    nights: 30,
    adults: 1,
    children: 0,
    pricePerNight: 85000,
    cleaningFee: 12750,
    serviceFee: 255000,
    totalAmount: 2817750,
    status: 'CONFIRMED',
    bookedAt: 'Apr 20, 2026'
  },
];
