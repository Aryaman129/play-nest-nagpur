import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Turf, TimeSlot, Booking } from '@/types';

// Booking flow state management for multi-step booking process
// Tracks user progress through: slot selection → details → payment → confirmation
interface BookingState {
  selectedTurf: Turf | null;        // Currently selected turf for booking
  selectedSlot: TimeSlot | null;    // Selected time slot
  selectedDate: Date | null;        // Selected booking date
  customerDetails: {                // Customer information for booking
    name: string;
    email: string;
    phone: string;
  } | null;
  totalPrice: number;               // Calculated total price with taxes
  currentStep: 'slot' | 'details' | 'payment' | 'confirmation'; // Current booking step
  bookingId: string | null;         // Created booking ID after successful creation
}

interface BookingContextType extends BookingState {
  setSelectedTurf: (turf: Turf | null) => void;
  setSelectedSlot: (slot: TimeSlot | null, date: Date | null) => void;
  setCustomerDetails: (details: BookingState['customerDetails']) => void;
  setCurrentStep: (step: BookingState['currentStep']) => void;
  setBookingId: (id: string | null) => void;
  calculateTotalPrice: () => number;
  resetBooking: () => void;
  isBookingComplete: () => boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

const initialState: BookingState = {
  selectedTurf: null,
  selectedSlot: null,
  selectedDate: null,
  customerDetails: null,
  totalPrice: 0,
  currentStep: 'slot',
  bookingId: null,
};

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookingState, setBookingState] = useState<BookingState>(initialState);

  const setSelectedTurf = (turf: Turf | null) => {
    setBookingState(prev => ({
      ...prev,
      selectedTurf: turf,
      // Reset dependent fields when turf changes
      selectedSlot: null,
      selectedDate: null,
      totalPrice: 0,
      currentStep: 'slot',
    }));
  };

  const setSelectedSlot = (slot: TimeSlot | null, date: Date | null) => {
    setBookingState(prev => {
      const newState = {
        ...prev,
        selectedSlot: slot,
        selectedDate: date,
      };
      
      // Calculate price when slot is selected
      if (slot && prev.selectedTurf) {
        newState.totalPrice = calculatePrice(slot, prev.selectedTurf);
      } else {
        newState.totalPrice = 0;
      }
      
      return newState;
    });
  };

  const setCustomerDetails = (details: BookingState['customerDetails']) => {
    setBookingState(prev => ({
      ...prev,
      customerDetails: details,
    }));
  };

  const setCurrentStep = (step: BookingState['currentStep']) => {
    setBookingState(prev => ({
      ...prev,
      currentStep: step,
    }));
  };

  const setBookingId = (id: string | null) => {
    setBookingState(prev => ({
      ...prev,
      bookingId: id,
    }));
  };

  const calculateTotalPrice = (): number => {
    const { selectedSlot, selectedTurf } = bookingState;
    if (!selectedSlot || !selectedTurf) return 0;
    
    return calculatePrice(selectedSlot, selectedTurf);
  };

  const calculatePrice = (slot: TimeSlot, turf: Turf): number => {
    // Extract hours from slot times
    const startHour = parseInt(slot.startTime.split(':')[0]);
    const endHour = parseInt(slot.endTime.split(':')[0]);
    const duration = endHour - startHour;
    
    // Apply pricing logic
    let basePrice = turf.basePrice;
    
    // Evening premium (6 PM onwards)
    if (startHour >= 18) {
      basePrice *= 1.25;
    }
    
    // Weekend premium (Saturday, Sunday)
    if (bookingState.selectedDate) {
      const dayOfWeek = bookingState.selectedDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        basePrice *= 1.15;
      }
    }
    
    return Math.round(basePrice * duration);
  };

  const resetBooking = () => {
    setBookingState(initialState);
  };

  const isBookingComplete = (): boolean => {
    return !!(
      bookingState.selectedTurf &&
      bookingState.selectedSlot &&
      bookingState.selectedDate &&
      bookingState.customerDetails &&
      bookingState.bookingId
    );
  };

  const value: BookingContextType = {
    ...bookingState,
    setSelectedTurf,
    setSelectedSlot,
    setCustomerDetails,
    setCurrentStep,
    setBookingId,
    calculateTotalPrice,
    resetBooking,
    isBookingComplete,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};