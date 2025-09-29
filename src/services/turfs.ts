import { Turf, TurfFilters, TimeSlot, ApiResponse, PaginatedResponse } from '@/types';
import { supabase } from './api';

export class TurfService {
  /**
   * Get all turfs with optional filters
   */
  async getTurfs(filters?: Partial<TurfFilters>): Promise<PaginatedResponse<Turf>> {
    try {
      let query = supabase
        .from('turfs')
        .select('*')
        .eq('verified', true)
        .order('rating', { ascending: false });
      
      // Apply filters
      if (filters) {
        if (filters.sports?.length) {
          query = query.overlaps('sports', filters.sports);
        }
        
        if (filters.priceRange) {
          query = query
            .gte('base_price', filters.priceRange.min)
            .lte('base_price', filters.priceRange.max);
        }
        
        if (filters.rating) {
          query = query.gte('rating', filters.rating);
        }
        
        if (filters.location) {
          query = query.ilike('location->>city', `%${filters.location}%`);
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw new Error(error.message);
      
      return {
        data: data as Turf[],
        success: true,
        timestamp: new Date(),
        pagination: {
          page: 1,
          limit: 10,
          total: data?.length || 0,
          totalPages: Math.ceil((data?.length || 0) / 10),
          hasNext: false,
          hasPrev: false,
        },
      };
    } catch (error: any) {
      throw {
        code: 'FETCH_FAILED',
        message: error.message || 'Failed to fetch turfs',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get turf by ID
   */
  async getTurfById(id: string): Promise<ApiResponse<Turf>> {
    try {
      const { data, error } = await supabase
        .from('turfs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw new Error(error.message);
      if (!data) throw new Error('Turf not found');
      
      return {
        data: data as Turf,
        success: true,
        timestamp: new Date(),
      };
    } catch (error: any) {
      throw {
        code: 'TURF_NOT_FOUND',
        message: error.message || 'Turf not found',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get nearby turfs using PostGIS (if enabled) or simple filtering
   */
  async getNearbyTurfs(
    lat: number,
    lng: number,
    radiusKm: number = 10
  ): Promise<ApiResponse<Array<Turf & { distance: number }>>> {
    try {
      // For now, we'll get all turfs and calculate distance client-side
      // In production, you'd want to use PostGIS for spatial queries
      const { data, error } = await supabase
        .from('turfs')
        .select('*')
        .eq('verified', true);
      
      if (error) throw new Error(error.message);
      
      const turfsWithDistance = data.map(turf => {
        const turfLat = turf.location?.lat || 0;
        const turfLng = turf.location?.lng || 0;
        const distance = this.calculateDistance(lat, lng, turfLat, turfLng);
        
        return {
          ...turf,
          distance,
        };
      }).filter(turf => turf.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);
      
      return {
        data: turfsWithDistance as Array<Turf & { distance: number }>,
        success: true,
        timestamp: new Date(),
      };
    } catch (error: any) {
      throw {
        code: 'NEARBY_FETCH_FAILED',
        message: error.message || 'Failed to fetch nearby turfs',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get available time slots for a turf on a specific date
   */
  async getTimeSlots(turfId: string, date: Date): Promise<ApiResponse<TimeSlot[]>> {
    try {
      // Get turf details for availability rules
      const { data: turf, error: turfError } = await supabase
        .from('turfs')
        .select('availability')
        .eq('id', turfId)
        .single();
      
      if (turfError) throw new Error(turfError.message);
      
      // Get existing bookings for the date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('slot_start, slot_end')
        .eq('turf_id', turfId)
        .gte('slot_start', startOfDay.toISOString())
        .lte('slot_end', endOfDay.toISOString())
        .in('status', ['confirmed', 'pending']);
      
      if (bookingsError) throw new Error(bookingsError.message);
      
      // Generate time slots based on turf availability
      const slots = this.generateTimeSlots(date, turf.availability, bookings || []);
      
      return {
        data: slots,
        success: true,
        timestamp: new Date(),
      };
    } catch (error: any) {
      throw {
        code: 'FETCH_FAILED',
        message: error.message || 'Failed to fetch time slots',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Search turfs by name, location, or sports
   */
  async searchTurfs(query: string): Promise<ApiResponse<Turf[]>> {
    try {
      const { data, error } = await supabase
        .from('turfs')
        .select('*')
        .eq('verified', true)
        .or(`name.ilike.%${query}%,location->>address.ilike.%${query}%,location->>city.ilike.%${query}%`)
        .order('rating', { ascending: false });
      
      if (error) throw new Error(error.message);
      
      return {
        data: data as Turf[],
        success: true,
        timestamp: new Date(),
      };
    } catch (error: any) {
      throw {
        code: 'SEARCH_FAILED',
        message: error.message || 'Search failed',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get popular turfs based on rating and reviews
   */
  async getPopularTurfs(): Promise<ApiResponse<Turf[]>> {
    try {
      const { data, error } = await supabase
        .from('turfs')
        .select('*')
        .eq('verified', true)
        .gte('rating', 4.0)
        .gte('total_reviews', 5)
        .order('rating', { ascending: false })
        .order('total_reviews', { ascending: false })
        .limit(6);
      
      if (error) throw new Error(error.message);
      
      return {
        data: data as Turf[],
        success: true,
        timestamp: new Date(),
      };
    } catch (error: any) {
      throw {
        code: 'FETCH_FAILED',
        message: error.message || 'Failed to fetch popular turfs',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Create new turf (for owners)
   */
  async createTurf(turfData: Omit<Turf, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Turf>> {
    try {
      const { data, error } = await supabase
        .from('turfs')
        .insert([turfData])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      
      return {
        data: data as Turf,
        success: true,
        timestamp: new Date(),
      };
    } catch (error: any) {
      throw {
        code: 'CREATE_FAILED',
        message: error.message || 'Failed to create turf',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Update turf (for owners)
   */
  async updateTurf(id: string, updates: Partial<Turf>): Promise<ApiResponse<Turf>> {
    try {
      const { data, error } = await supabase
        .from('turfs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      
      return {
        data: data as Turf,
        success: true,
        timestamp: new Date(),
      };
    } catch (error: any) {
      throw {
        code: 'UPDATE_FAILED',
        message: error.message || 'Failed to update turf',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Upload turf photo to storage
   */
  async uploadTurfPhoto(turfId: string, file: File): Promise<string> {
    try {
      const fileName = `${turfId}/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('turf-photos')
        .upload(fileName, file);
      
      if (uploadError) throw new Error(uploadError.message);
      
      const { data } = supabase.storage
        .from('turf-photos')
        .getPublicUrl(fileName);
      
      return data.publicUrl;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload photo');
    }
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Generate time slots based on turf availability and existing bookings
   */
  private generateTimeSlots(date: Date, availability: any, bookings: any[]): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const openTime = availability?.openTime || '06:00';
    const closeTime = availability?.closeTime || '22:00';
    
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);
    
    for (let hour = openHour; hour < closeHour; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(date);
      slotEnd.setHours(hour + 1, 0, 0, 0);
      
      // Check if slot conflicts with existing bookings
      const isBooked = bookings.some(booking => {
        const bookingStart = new Date(booking.slot_start);
        const bookingEnd = new Date(booking.slot_end);
        return (slotStart < bookingEnd && slotEnd > bookingStart);
      });
      
      slots.push({
        id: `${date.toISOString().split('T')[0]}_${startTime}`,
        startTime,
        endTime,
        isAvailable: !isBooked,
        price: 1000, // Base price, could be dynamic
        date,
      });
    }
    
    return slots;
  }
}

export const turfService = new TurfService();