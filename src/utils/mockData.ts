import { Turf, User, Booking, Review } from '@/types';

// Mock sports data
export const SPORTS = [
  'Football',
  'Cricket',
  'Basketball',
  'Tennis',
  'Badminton',
  'Volleyball',
  'Table Tennis',
  'Hockey',
];

// Mock amenities
export const AMENITIES = [
  { id: 'parking', name: 'Parking', icon: '🚗', description: 'Free parking available' },
  { id: 'washroom', name: 'Washroom', icon: '🚿', description: 'Clean washroom facilities' },
  { id: 'water', name: 'Drinking Water', icon: '💧', description: 'Free drinking water' },
  { id: 'lighting', name: 'Floodlights', icon: '💡', description: 'Night play available' },
  { id: 'equipment', name: 'Equipment', icon: '⚽', description: 'Sports equipment rental' },
  { id: 'canteen', name: 'Canteen', icon: '🍕', description: 'Food and beverages' },
  { id: 'firstaid', name: 'First Aid', icon: '🏥', description: 'First aid kit available' },
  { id: 'coaching', name: 'Coaching', icon: '👨‍🏫', description: 'Professional coaching' },
];

// Mock users
export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'john.doe@email.com',
    name: 'John Doe',
    phone: '+91 9876543210',
    role: 'customer',
    verified: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    email: 'owner@turfs.com',
    name: 'Rajesh Kumar',
    phone: '+91 9876543211',
    role: 'owner',
    verified: true,
    createdAt: new Date('2023-12-01'),
  },
  {
    id: '3',
    email: 'admin@playnest.com',
    name: 'Admin User',
    phone: '+91 9876543212',
    role: 'admin',
    verified: true,
    createdAt: new Date('2023-11-01'),
  },
];

// Mock turfs - 10 diverse locations
export const MOCK_TURFS: Turf[] = [
  {
    id: '1',
    name: 'Green Valley Sports Complex',
    description: 'Premium football and cricket facility with modern amenities',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Sector 18, Near Metro Station',
      landmark: 'Opposite City Mall',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
    },
    basePrice: 1200,
    sports: ['Football', 'Cricket'],
    photos: ['/assets/hero-turf.jpg', '/assets/cricket-turf.jpg'],
    idealPlayers: 22,
    amenities: [AMENITIES[0], AMENITIES[1], AMENITIES[2], AMENITIES[3]],
    rating: 4.8,
    totalReviews: 156,
    ownerId: '2',
    verified: true,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-15'),
    availability: {
      openTime: '06:00',
      closeTime: '22:00',
      daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    rules: [
      'No smoking on premises',
      'Proper sports attire required',
      'Players must be above 12 years',
      'No food allowed on turf',
    ],
    size: {
      length: 100,
      width: 60,
      unit: 'm',
    },
  },
  {
    id: '2',
    name: 'Champions Arena',
    description: 'Multi-sport facility perfect for basketball and badminton',
    location: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Andheri West, Near Railway Station',
      landmark: 'Behind Phoenix Mall',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400058',
    },
    basePrice: 800,
    sports: ['Basketball', 'Badminton'],
    photos: ['/assets/badminton-turf.jpg'],
    idealPlayers: 10,
    amenities: [AMENITIES[0], AMENITIES[1], AMENITIES[5], AMENITIES[7]],
    rating: 4.5,
    totalReviews: 89,
    ownerId: '2',
    verified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10'),
    availability: {
      openTime: '05:30',
      closeTime: '23:00',
      daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    rules: [
      'Non-marking shoes only',
      'Court shoes mandatory for basketball',
      'Maximum 2 hours per booking',
      'No outside food or drinks',
    ],
    size: {
      length: 28,
      width: 15,
      unit: 'm',
    },
  },
  {
    id: '3',
    name: 'Elite Tennis Club',
    description: 'Professional tennis courts with coaching facility',
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Koramangala, 5th Block',
      landmark: 'Near Forum Mall',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560095',
    },
    basePrice: 1500,
    sports: ['Tennis'],
    photos: ['/assets/tennis-turf.jpg'],
    idealPlayers: 4,
    amenities: [AMENITIES[0], AMENITIES[1], AMENITIES[2], AMENITIES[4], AMENITIES[7]],
    rating: 4.9,
    totalReviews: 234,
    ownerId: '2',
    verified: true,
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2024-01-20'),
    availability: {
      openTime: '06:00',
      closeTime: '21:00',
      daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    rules: [
      'Tennis attire mandatory',
      'Advance booking required',
      'Professional coaching available',
      'Equipment rental available',
    ],
    size: {
      length: 78,
      width: 36,
      unit: 'ft',
    },
  },
];

// Mock bookings
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'book_001',
    customerId: '1',
    turfId: '1',
    slotStart: new Date('2024-01-25T18:00:00'),
    slotEnd: new Date('2024-01-25T20:00:00'),
    price: 2400,
    advancePaid: 1200,
    status: 'confirmed',
    receiptId: 'rcpt_001',
    paymentMethod: 'online',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    customerDetails: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91 9876543210',
    },
    turfDetails: {
      name: 'Green Valley Sports Complex',
      address: 'Sector 18, Near Metro Station',
      sports: ['Football'],
    },
    qrCode: 'QR_book_001_verify',
  },
  {
    id: 'book_002',
    customerId: '1',
    turfId: '2',
    slotStart: new Date('2024-01-28T16:00:00'),
    slotEnd: new Date('2024-01-28T17:00:00'),
    price: 800,
    advancePaid: 400,
    status: 'pending',
    receiptId: 'rcpt_002',
    paymentMethod: 'upi',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    customerDetails: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91 9876543210',
    },
    turfDetails: {
      name: 'Champions Arena',
      address: 'Andheri West, Near Railway Station',
      sports: ['Basketball'],
    },
    qrCode: 'QR_book_002_verify',
  },
];

// Mock reviews
export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev_001',
    bookingId: 'book_001',
    customerId: '1',
    turfId: '1',
    rating: 5,
    comment: 'Excellent facility with great amenities. The turf quality is top-notch!',
    photos: [],
    createdAt: new Date('2024-01-21'),
    verified: true,
  },
  {
    id: 'rev_002',
    bookingId: 'book_002',
    customerId: '1',
    turfId: '2',
    rating: 4,
    comment: 'Good courts, could use better lighting in the evening.',
    photos: [],
    createdAt: new Date('2024-01-22'),
    verified: true,
  },
];

// Mock time slots for today
export const generateMockTimeSlots = (date: Date) => {
  const slots = [];
  for (let hour = 6; hour < 22; hour += 2) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 2).toString().padStart(2, '0')}:00`;
    
    slots.push({
      id: `slot_${hour}`,
      startTime,
      endTime,
      isAvailable: Math.random() > 0.3, // 70% availability
      price: hour >= 18 ? 1500 : 1200, // Evening premium
      date,
    });
  }
  return slots;
};