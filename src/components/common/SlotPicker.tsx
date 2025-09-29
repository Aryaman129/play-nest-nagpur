import { useState } from 'react';
import { format, addDays, startOfDay } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppToast } from '@/components/common/Toast';
import { cn } from '@/lib/utils';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
}

interface SlotPickerProps {
  onSelect: (date: Date, timeSlot: TimeSlot) => void;
  selectedDate?: Date;
  selectedSlot?: TimeSlot;
  availableSlots?: TimeSlot[];
}

const SlotPicker: React.FC<SlotPickerProps> = ({
  onSelect,
  selectedDate,
  selectedSlot,
  availableSlots = []
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const { success, info } = useAppToast();

  // Mock time slots - replace with API data
  const mockTimeSlots: TimeSlot[] = [
    { id: '1', startTime: '06:00', endTime: '07:00', isAvailable: true, price: 800 },
    { id: '2', startTime: '07:00', endTime: '08:00', isAvailable: true, price: 1000 },
    { id: '3', startTime: '08:00', endTime: '09:00', isAvailable: false, price: 1000 },
    { id: '4', startTime: '09:00', endTime: '10:00', isAvailable: true, price: 1200 },
    { id: '5', startTime: '17:00', endTime: '18:00', isAvailable: true, price: 1500 },
    { id: '6', startTime: '18:00', endTime: '19:00', isAvailable: true, price: 1800 },
    { id: '7', startTime: '19:00', endTime: '20:00', isAvailable: false, price: 1800 },
    { id: '8', startTime: '20:00', endTime: '21:00', isAvailable: true, price: 2000 }
  ];

  const timeSlots = availableSlots.length > 0 ? availableSlots : mockTimeSlots;

  // Generate next 7 days
  const availableDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    if (timeSlot.isAvailable) {
      onSelect(currentDate, timeSlot);
    }
  };

  // **BACKEND INTEGRATION**: Waitlist functionality
  const handleWaitlistJoin = async (timeSlot: TimeSlot) => {
    try {
      // TODO: Implement backend waitlist API call
      // await waitlistService.joinWaitlist({
      //   turfId: 'current_turf_id',
      //   slotStart: new Date(`${format(currentDate, 'yyyy-MM-dd')}T${timeSlot.startTime}`),
      //   slotEnd: new Date(`${format(currentDate, 'yyyy-MM-dd')}T${timeSlot.endTime}`),
      //   notifyEmail: 'user@email.com',
      //   notifyPhone: '+91 9876543210'
      // });

      success('🔔 Joined waitlist successfully!');
      info(`You'll be notified if ${timeSlot.startTime}-${timeSlot.endTime} becomes available on ${format(currentDate, 'MMM d')}`);
    } catch (error) {
      console.error('Waitlist join failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          Select Date
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {availableDates.map((date, index) => {
            const isSelected = format(date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');
            const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDateSelect(date)}
                className={cn(
                  'p-3 rounded-lg border text-center transition-all duration-200',
                  isSelected 
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                    : 'bg-card text-card-foreground border-border hover:border-primary/50',
                  isToday && !isSelected && 'border-accent text-accent'
                )}
              >
                <div className="text-xs font-medium">
                  {format(date, 'EEE')}
                </div>
                <div className="text-lg font-bold">
                  {format(date, 'd')}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Selection */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
          <Clock className="w-5 h-5 text-primary" />
          Available Time Slots
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {timeSlots.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;
            
            return (
              <motion.div
                key={slot.id}
                whileHover={slot.isAvailable ? { scale: 1.05 } : {}}
                whileTap={slot.isAvailable ? { scale: 0.95 } : {}}
                className={cn(
                  'p-4 rounded-lg border text-center transition-all duration-200',
                  slot.isAvailable
                    ? isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                      : 'bg-card text-card-foreground border-border hover:border-primary/50 hover:shadow-md'
                    : 'bg-muted text-muted-foreground border-border opacity-75'
                )}
              >
                <div className="font-semibold text-sm">
                  {slot.startTime} - {slot.endTime}
                </div>
                <div className="text-xs mt-1">
                  ₹{slot.price}
                </div>
                
                {slot.isAvailable ? (
                  <Button
                    size="sm"
                    onClick={() => handleTimeSlotSelect(slot)}
                    className="mt-2 w-full h-6 text-xs"
                    variant={isSelected ? "secondary" : "default"}
                    aria-label={`Book slot ${slot.startTime} to ${slot.endTime}`}
                  >
                    {isSelected ? 'Selected' : 'Book Now'}
                  </Button>
                ) : (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-destructive">
                      Fully Booked
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleWaitlistJoin(slot)}
                      className="w-full h-6 text-xs"
                      aria-label={`Join waitlist for ${slot.startTime} to ${slot.endTime}`}
                    >
                      📋 Join Waitlist
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {selectedSlot && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-turf"
        >
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-foreground">Selected Slot</h4>
              <p className="text-muted-foreground">
                {format(currentDate, 'EEEE, MMMM d, yyyy')} • {selectedSlot.startTime} - {selectedSlot.endTime}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">₹{selectedSlot.price}</p>
              <p className="text-sm text-muted-foreground">per hour</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SlotPicker;