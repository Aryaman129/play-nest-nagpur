import { supabase } from './api';
import { Booking, BookingRequest, Review, ReviewRequest } from '../types/booking';
import { Turf } from '../types/turf';

export class BookingService {
  private static isValidTimeSlot(slot: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(slot);
  }

  private static generateTimeSlots(): string[] {
    const slots: string[] = [];
    for (let i = 6; i < 24; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }

  private static calculatePrice(turf: Turf, slotStart: Date, slotEnd: Date): number {
    const hour = slotStart.getHours();
    const duration = (slotEnd.getTime() - slotStart.getTime()) / (1000 * 60 * 60); // hours
    
    let pricePerHour = turf.basePrice;
    
    // Prime time pricing (evening hours)
    if (hour >= 18 || hour < 6) {
      pricePerHour = turf.basePrice * 1.5; // 50% premium for prime time
    }
    
    return Math.round(pricePerHour * duration);
  }

  private static formatBookingForDatabase(booking: BookingRequest, userId: string, price: number): any {
    return {
      user_id: userId,
      turf_id: booking.turfId,
      booking_date: booking.slotStart.toISOString().split('T')[0],
      time_slot: booking.slotStart.toTimeString().substring(0, 5),
      slot_start: booking.slotStart.toISOString(),
      slot_end: booking.slotEnd.toISOString(),
      total_amount: price,
      advance_paid: price, // For now, full payment upfront
      status: 'confirmed',
      payment_status: 'completed',
      payment_method: booking.paymentMethod,
      customer_name: booking.customerDetails.name,
      customer_email: booking.customerDetails.email,
      customer_phone: booking.customerDetails.phone,
      special_requests: booking.notes || null
    };
  }

  private static formatBookingResponse(dbBooking: any): Booking {
    return {
      id: dbBooking.id,
      customerId: dbBooking.user_id,
      turfId: dbBooking.turf_id,
      slotStart: new Date(dbBooking.slot_start),
      slotEnd: new Date(dbBooking.slot_end),
      price: dbBooking.total_amount,
      advancePaid: dbBooking.advance_paid,
      status: dbBooking.status,
      receiptId: dbBooking.receipt_id || `REC-${dbBooking.id}`,
      paymentMethod: dbBooking.payment_method,
      createdAt: new Date(dbBooking.created_at),
      updatedAt: new Date(dbBooking.updated_at || dbBooking.created_at),
      customerDetails: {
        name: dbBooking.customer_name,
        email: dbBooking.customer_email,
        phone: dbBooking.customer_phone
      },
      turfDetails: dbBooking.turfs ? {
        name: dbBooking.turfs.name,
        address: dbBooking.turfs.location.address,
        sports: dbBooking.turfs.sports
      } : {
        name: 'Unknown Turf',
        address: 'Address not available',
        sports: []
      },
      notes: dbBooking.special_requests,
      qrCode: `QR-${dbBooking.id}` // Generate QR code reference
    };
  }

  static async createBooking(bookingRequest: BookingRequest): Promise<Booking> {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Get turf details
      const { data: turf, error: turfError } = await supabase
        .from('turfs')
        .select('*')
        .eq('id', bookingRequest.turfId)
        .single();

      if (turfError || !turf) {
        throw new Error('Turf not found');
      }

      // Transform database turf to frontend Turf type
      const frontendTurf: Turf = {
        id: turf.id,
        name: turf.name,
        description: turf.description,
        location: turf.location,
        basePrice: turf.pricing?.regular || 500,
        sports: turf.sports,
        photos: turf.images,
        idealPlayers: turf.ideal_players || 10,
        amenities: turf.amenities?.map((amenity: any) => ({
          id: amenity.id || amenity.name,
          name: amenity.name || amenity,
          icon: amenity.icon || '🏃',
          description: amenity.description
        })) || [],
        rating: turf.rating,
        totalReviews: turf.review_count,
        ownerId: turf.owner_id,
        verified: true,
        createdAt: new Date(turf.created_at),
        updatedAt: new Date(turf.updated_at || turf.created_at),
        availability: turf.availability || {
          openTime: '06:00',
          closeTime: '23:00',
          daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        rules: turf.rules || [],
        size: turf.size || { length: 100, width: 60, unit: 'ft' }
      };

      // Check if slot is already booked
      const { data: existingBooking, error: checkError } = await supabase
        .from('bookings')
        .select('id')
        .eq('turf_id', bookingRequest.turfId)
        .eq('slot_start', bookingRequest.slotStart.toISOString())
        .eq('status', 'confirmed')
        .maybeSingle();

      if (checkError) {
        throw new Error('Error checking slot availability');
      }

      if (existingBooking) {
        throw new Error('This time slot is already booked');
      }

      // Calculate price
      const price = BookingService.calculatePrice(frontendTurf, bookingRequest.slotStart, bookingRequest.slotEnd);

      // Create booking
      const bookingData = BookingService.formatBookingForDatabase(bookingRequest, user.id, price);
      
      const { data: newBooking, error: createError } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select(`
          *,
          turfs (
            id,
            name,
            location,
            sports
          )
        `)
        .single();

      if (createError) {
        throw new Error(`Failed to create booking: ${createError.message}`);
      }

      return BookingService.formatBookingResponse(newBooking);
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  static async getUserBookings(): Promise<Booking[]> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          turfs (
            id,
            name,
            location,
            sports
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch bookings: ${error.message}`);
      }

      return bookings?.map(BookingService.formatBookingResponse) || [];
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  static async updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'canceled' | 'completed' | 'refunded'): Promise<void> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(`Failed to update booking status: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  static async getAvailableSlots(turfId: string, date: Date): Promise<string[]> {
    try {
      const dateStr = date.toISOString().split('T')[0];
      
      const { data: bookedSlots, error } = await supabase
        .from('bookings')
        .select('slot_start, slot_end')
        .eq('turf_id', turfId)
        .eq('booking_date', dateStr)
        .eq('status', 'confirmed');

      if (error) {
        throw new Error(`Failed to fetch booked slots: ${error.message}`);
      }

      const allSlots = BookingService.generateTimeSlots();
      const bookedTimes = bookedSlots?.map(booking => {
        const startTime = new Date(booking.slot_start);
        return startTime.toTimeString().substring(0, 5);
      }) || [];

      return allSlots.filter(slot => !bookedTimes.includes(slot));
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  }

  static async createReview(reviewRequest: ReviewRequest): Promise<Review> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Verify the booking exists and belongs to the user
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('id, turf_id')
        .eq('id', reviewRequest.bookingId)
        .eq('user_id', user.id)
        .single();

      if (bookingError || !booking) {
        throw new Error('Booking not found or does not belong to user');
      }

      // Check if review already exists
      const { data: existingReview, error: checkError } = await supabase
        .from('reviews')
        .select('id')
        .eq('booking_id', reviewRequest.bookingId)
        .maybeSingle();

      if (checkError) {
        throw new Error('Error checking existing review');
      }

      if (existingReview) {
        throw new Error('Review already exists for this booking');
      }

      // Create review
      const { data: newReview, error: createError } = await supabase
        .from('reviews')
        .insert([{
          user_id: user.id,
          turf_id: booking.turf_id,
          booking_id: reviewRequest.bookingId,
          rating: reviewRequest.rating,
          comment: reviewRequest.comment || null
        }])
        .select('*')
        .single();

      if (createError) {
        throw new Error(`Failed to create review: ${createError.message}`);
      }

      // Update turf rating
      await BookingService.updateTurfRating(booking.turf_id);

      return {
        id: newReview.id,
        customerId: newReview.user_id,
        turfId: newReview.turf_id,
        bookingId: newReview.booking_id,
        rating: newReview.rating,
        comment: newReview.comment,
        photos: [],
        createdAt: new Date(newReview.created_at),
        verified: false
      };
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  private static async updateTurfRating(turfId: string): Promise<void> {
    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('turf_id', turfId);

      if (error) {
        console.error('Error fetching reviews for rating update:', error);
        return;
      }

      if (reviews && reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await supabase
          .from('turfs')
          .update({
            rating: Math.round(averageRating * 10) / 10,
            review_count: reviews.length
          })
          .eq('id', turfId);
      }
    } catch (error) {
      console.error('Error updating turf rating:', error);
    }
  }
}