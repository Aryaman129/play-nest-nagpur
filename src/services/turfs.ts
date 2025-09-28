import { Turf, TurfFilters, TimeSlot, ApiResponse, PaginatedResponse } from '@/types';
import { apiClient } from './api';
import { MOCK_TURFS, generateMockTimeSlots } from '@/utils/mockData';
import { getTurfsWithinRadius } from '@/utils/calculateDistance';

export class TurfService {
  /**
   * Get all turfs with optional filters
   */
  async getTurfs(filters?: Partial<TurfFilters>): Promise<PaginatedResponse<Turf>> {
    try {
      await apiClient.get('/turfs');
      
      let filteredTurfs = [...MOCK_TURFS];
      
      // Apply filters
      if (filters) {
        if (filters.sports?.length) {
          filteredTurfs = filteredTurfs.filter(turf =>
            turf.sports.some(sport => filters.sports?.includes(sport))
          );
        }
        
        if (filters.priceRange) {
          filteredTurfs = filteredTurfs.filter(turf =>
            turf.basePrice >= filters.priceRange!.min &&
            turf.basePrice <= filters.priceRange!.max
          );
        }
        
        if (filters.rating) {
          filteredTurfs = filteredTurfs.filter(turf => turf.rating >= filters.rating!);
        }
        
        if (filters.amenities?.length) {
          filteredTurfs = filteredTurfs.filter(turf =>
            filters.amenities?.some(amenityId =>
              turf.amenities.some(amenity => amenity.id === amenityId)
            )
          );
        }
      }
      
      return {
        data: filteredTurfs,
        success: true,
        timestamp: new Date(),
        pagination: {
          page: 1,
          limit: 10,
          total: filteredTurfs.length,
          totalPages: Math.ceil(filteredTurfs.length / 10),
          hasNext: false,
          hasPrev: false,
        },
      };
    } catch (error) {
      throw {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch turfs',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get turf by ID
   */
  async getTurfById(id: string): Promise<ApiResponse<Turf>> {
    try {
      await apiClient.get(`/turfs/${id}`);
      
      const turf = MOCK_TURFS.find(t => t.id === id);
      
      if (!turf) {
        throw new Error('Turf not found');
      }
      
      return {
        data: turf,
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      throw {
        code: 'TURF_NOT_FOUND',
        message: 'Turf not found',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get nearby turfs
   */
  async getNearbyTurfs(
    lat: number,
    lng: number,
    radiusKm: number = 10
  ): Promise<ApiResponse<Array<Turf & { distance: number }>>> {
    try {
      await apiClient.get(`/turfs/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`);
      
      const nearbyTurfs = getTurfsWithinRadius(MOCK_TURFS, lat, lng, radiusKm);
      
      return {
        data: nearbyTurfs,
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      throw {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch nearby turfs',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get available time slots for a turf on a specific date
   */
  async getTimeSlots(turfId: string, date: Date): Promise<ApiResponse<TimeSlot[]>> {
    try {
      await apiClient.get(`/turfs/${turfId}/slots?date=${date.toISOString()}`);
      
      const turf = MOCK_TURFS.find(t => t.id === turfId);
      if (!turf) {
        throw new Error('Turf not found');
      }
      
      const slots = generateMockTimeSlots(date);
      
      return {
        data: slots,
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      throw {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch time slots',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Search turfs by name or location
   */
  async searchTurfs(query: string): Promise<ApiResponse<Turf[]>> {
    try {
      await apiClient.get(`/turfs/search?q=${encodeURIComponent(query)}`);
      
      const results = MOCK_TURFS.filter(turf =>
        turf.name.toLowerCase().includes(query.toLowerCase()) ||
        turf.location.address.toLowerCase().includes(query.toLowerCase()) ||
        turf.location.city.toLowerCase().includes(query.toLowerCase()) ||
        turf.sports.some(sport => sport.toLowerCase().includes(query.toLowerCase()))
      );
      
      return {
        data: results,
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      throw {
        code: 'SEARCH_FAILED',
        message: 'Search failed',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get popular turfs
   */
  async getPopularTurfs(): Promise<ApiResponse<Turf[]>> {
    try {
      await apiClient.get('/turfs/popular');
      
      // Sort by rating and total reviews
      const popular = [...MOCK_TURFS]
        .sort((a, b) => (b.rating * b.totalReviews) - (a.rating * a.totalReviews))
        .slice(0, 6);
      
      return {
        data: popular,
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      throw {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch popular turfs',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Admin: Create new turf
   */
  async createTurf(turfData: Omit<Turf, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Turf>> {
    try {
      await apiClient.post('/admin/turfs', turfData);
      
      const newTurf: Turf = {
        ...turfData,
        id: 'turf_' + Date.now(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      MOCK_TURFS.push(newTurf);
      
      return {
        data: newTurf,
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      throw {
        code: 'CREATE_FAILED',
        message: 'Failed to create turf',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Owner/Admin: Update turf
   */
  async updateTurf(id: string, updates: Partial<Turf>): Promise<ApiResponse<Turf>> {
    try {
      await apiClient.put(`/turfs/${id}`, updates);
      
      const turfIndex = MOCK_TURFS.findIndex(t => t.id === id);
      if (turfIndex === -1) {
        throw new Error('Turf not found');
      }
      
      const updatedTurf = {
        ...MOCK_TURFS[turfIndex],
        ...updates,
        updatedAt: new Date(),
      };
      
      MOCK_TURFS[turfIndex] = updatedTurf;
      
      return {
        data: updatedTurf,
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      throw {
        code: 'UPDATE_FAILED',
        message: 'Failed to update turf',
        timestamp: new Date(),
      };
    }
  }
}

export const turfService = new TurfService();