import { Booking, BookingRequest, Review, Waitlist, ApiResponse, PaginatedResponse } from '@/types';
import { apiClient } from './api';
import { MOCK_BOOKINGS, MOCK_REVIEWS } from '@/utils/mockData';

// Booking management service for all booking-related operations
// Backend Integration: Connect to bookings, reviews, and waitlist tables
export class BookingService {
  /**
   * Create a new booking record
   * Backend: POST /bookings - Insert into bookings table with availability check
   * Should validate slot availability and prevent double booking
   */
  async createBooking(bookingData: BookingRequest): Promise<ApiResponse<Booking>> {
    try {
      // Backend: Create booking record with slot availability validation
      await apiClient.post('/bookings', bookingData);
      
      // Mock booking creation - REPLACE WITH BACKEND RESPONSE
      const newBooking: Booking = {
        id: 'book_' + Date.now(),                    // Backend generates UUID
        customerId: bookingData.customerId,         // User making the booking
        turfId: bookingData.turfId,                 // Target turf
        slotStart: bookingData.slotStart,           // Booking start time
        slotEnd: bookingData.slotEnd,               // Booking end time
        price: this.calculatePrice(bookingData.slotStart, bookingData.slotEnd), // Dynamic pricing
        advancePaid: 0,                             // Updated after payment processing
        status: 'pending',                          // Initial status, changes after payment
        receiptId: '',                              // Generated after payment
        paymentMethod: bookingData.paymentMethod,   // Customer selected payment method
        createdAt: new Date(),                      // Booking creation timestamp
        updatedAt: new Date(),                      // Last update timestamp
        customerDetails: bookingData.customerDetails, // Customer info for the booking
        turfDetails: {                              // Populated from turf data
          name: 'Mock Turf Name',                   // Fetch from turfs table
          address: 'Mock Address',                  // Fetch from turfs table
          sports: ['Football'],                     // Fetch from turfs table
        },
        notes: bookingData.notes,                   // Optional customer notes
        qrCode: `QR_${Date.now()}_verify`,          // Generate unique QR for check-in
      };
      
      // Add to mock storage - BACKEND HANDLES THIS
      MOCK_BOOKINGS.push(newBooking);
      
      return {
        data: newBooking,
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      // Handle booking creation failures
      throw {
        code: 'BOOKING_FAILED',
        message: 'Failed to create booking',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get user bookings
   */
  async getUserBookings(
    userId: string,
    status?: Booking['status']
  ): Promise<PaginatedResponse<Booking>> {
    try {
      await apiClient.get(`/users/${userId}/bookings`);
      
      let userBookings = MOCK_BOOKINGS.filter(b => b.customerId === userId);
      
      if (status) {
        userBookings = userBookings.filter(b => b.status === status);
      }
      
      // Sort by creation date (newest first)
      userBookings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      return {
        data: userBookings,
        success: true,
        timestamp: new Date(),
        pagination: {
          page: 1,
          limit: 10,
          total: userBookings.length,
          totalPages: Math.ceil(userBookings.length / 10),
          hasNext: false,
          hasPrev: false,
        },
      };
    } catch (error) {
      throw {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch bookings',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get turf bookings (for owners)
   */
  async getTurfBookings(
    turfId: string,
    date?: Date
  ): Promise<PaginatedResponse<Booking>> {
    try {
      await apiClient.get(`/turfs/${turfId}/bookings`);
      
      let turfBookings = MOCK_BOOKINGS.filter(b => b.turfId === turfId);
      
      if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        turfBookings = turfBookings.filter(b =>
          b.slotStart >= startOfDay && b.slotStart <= endOfDay
        );
      }
      
      turfBookings.sort((a, b) => a.slotStart.getTime() - b.slotStart.getTime());
      
      return {
        data: turfBookings,
        success: true,
        timestamp: new Date(),
        pagination: {
          page: 1,
          limit: 20,
          total: turfBookings.length,
          totalPages: Math.ceil(turfBookings.length / 20),
          hasNext: false,
          hasPrev: false,
        },
      };
    } catch (error) {
      throw {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch turf bookings',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(
    bookingId: string,
    status: Booking['status'],
    notes?: string
  ): Promise<ApiResponse<Booking>> {
    try {
      await apiClient.put(`/bookings/${bookingId}/status`, { status, notes });
      
      const bookingIndex = MOCK_BOOKINGS.findIndex(b => b.id === bookingId);
      if (bookingIndex === -1) {
        throw new Error('Booking not found');
      }
      
      const updatedBooking = {
        ...MOCK_BOOKINGS[bookingIndex],
        status,
        notes: notes || MOCK_BOOKINGS[bookingIndex].notes,
        updatedAt: new Date(),
      };
      
      MOCK_BOOKINGS[bookingIndex] = updatedBooking;
      
      return {
        data: updatedBooking,
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      throw {
        code: 'UPDATE_FAILED',
        message: 'Failed to update booking',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId: string, reason?: string): Promise<ApiResponse<Booking>> {
    return this.updateBookingStatus(bookingId, 'canceled', reason);
  }

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId: string): Promise<ApiResponse<Booking>> {
    try {
      await apiClient.get(`/bookings/${bookingId}`);
      
      const booking = MOCK_BOOKINGS.find(b => b.id === bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      return {
        data: booking,
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      throw {
        code: 'BOOKING_NOT_FOUND',
        message: 'Booking not found',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Verify QR code for check-in
   */
  async verifyQRCode(qrCode: string): Promise<ApiResponse<Booking>> {
    try {
      await apiClient.post('/bookings/verify-qr', { qrCode });
      
      const booking = MOCK_BOOKINGS.find(b => b.qrCode === qrCode);
      if (!booking) {
        throw new Error('Invalid QR code');
      }
      
      return {
        data: booking,
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      throw {
        code: 'INVALID_QR',
        message: 'Invalid or expired QR code',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Add review for booking
   */
  async addReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'verified'>): Promise<ApiResponse<Review>> {
    try {
      await apiClient.post('/reviews', reviewData);
      
      const newReview: Review = {
        ...reviewData,
        id: 'rev_' + Date.now(),
        createdAt: new Date(),
        verified: true,
      };
      
      MOCK_REVIEWS.push(newReview);
      
      return {
        data: newReview,
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      throw {
        code: 'REVIEW_FAILED',
        message: 'Failed to add review',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Join waitlist for fully booked slot
   */
  async joinWaitlist(waitlistData: Omit<Waitlist, 'id' | 'status' | 'createdAt'>): Promise<ApiResponse<Waitlist>> {
    try {
      await apiClient.post('/waitlist', waitlistData);
      
      const newWaitlistEntry: Waitlist = {
        ...waitlistData,
        id: 'wait_' + Date.now(),
        status: 'active',
        createdAt: new Date(),
      };
      
      return {
        data: newWaitlistEntry,
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      throw {
        code: 'WAITLIST_FAILED',
        message: 'Failed to join waitlist',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Calculate booking price
   */
  private calculatePrice(slotStart: Date, slotEnd: Date): number {
    const hours = (slotEnd.getTime() - slotStart.getTime()) / (1000 * 60 * 60);
    const basePrice = 1200; // Mock base price
    const isEvening = slotStart.getHours() >= 18;
    const price = isEvening ? basePrice * 1.25 : basePrice; // Evening premium
    
    return price * hours;
  }
}

export const bookingService = new BookingService();