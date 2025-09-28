import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BookingForm from '@/components/customer/BookingForm';

const Booking = () => {
  const { turfId } = useParams<{ turfId: string }>();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <BookingForm 
          turfId={turfId || ''} 
          turfName="Sports Arena Nagpur" 
          turfPrice={1200}
        />
      </div>
    </div>
  );
};

export default Booking;