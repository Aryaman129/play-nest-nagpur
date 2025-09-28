export interface Booking {
  id: string;
  customerId: string;
  turfId: string;
  slotStart: Date;
  slotEnd: Date;
  price: number;
  advancePaid: number;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed' | 'refunded';
  receiptId: string;
  paymentMethod: 'online' | 'cash' | 'upi';
  createdAt: Date;
  updatedAt: Date;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  turfDetails: {
    name: string;
    address: string;
    sports: string[];
  };
  notes?: string;
  qrCode?: string;
}

export interface BookingRequest {
  turfId: string;
  customerId: string;
  slotStart: Date;
  slotEnd: Date;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  paymentMethod: 'online' | 'cash' | 'upi';
  notes?: string;
}

export interface PaymentDetails {
  orderId: string;
  amount: number;
  currency: string;
  method: 'online' | 'cash' | 'upi';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  transactionId?: string;
  gateway: 'razorpay' | 'paytm' | 'phonepe' | 'cash';
}

export interface Receipt {
  id: string;
  bookingId: string;
  amount: number;
  tax: number;
  total: number;
  generatedAt: Date;
  downloadUrl: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  turfId: string;
  rating: number;
  comment: string;
  photos: string[];
  createdAt: Date;
  verified: boolean;
}

export interface Waitlist {
  id: string;
  customerId: string;
  turfId: string;
  slotStart: Date;
  slotEnd: Date;
  notifyEmail: string;
  notifyPhone: string;
  status: 'active' | 'notified' | 'expired';
  createdAt: Date;
}