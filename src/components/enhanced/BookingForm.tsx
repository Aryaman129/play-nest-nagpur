import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CreditCard,
  QrCode,
  Check,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppToast } from '@/components/common/Toast';
import { Turf, TimeSlot } from '@/types/turf';
import { BookingRequest } from '@/types/booking';
import PaymentGateway from '@/components/payment/PaymentGateway';

interface BookingFormProps {
  turf: Turf;
  selectedSlot: TimeSlot;
  selectedDate: Date;
  onBookingComplete: (bookingId: string) => void;
  onCancel: () => void;
}

const BookingForm = ({ turf, selectedSlot, selectedDate, onBookingComplete, onCancel }: BookingFormProps) => {
  const { success, error } = useAppToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash' | 'upi'>('online');
  const [specialRequests, setSpecialRequests] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Calculate pricing
  const basePrice = selectedSlot.price;
  const duration = 2; // hours
  const tax = Math.round(basePrice * 0.18); // 18% GST
  const totalAmount = basePrice + tax;
  const advanceAmount = paymentMethod === 'cash' ? Math.round(totalAmount * 0.5) : totalAmount;

  const handleCustomerDetailsSubmit = () => {
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      error('Please fill all customer details');
      return;
    }
    setStep(2);
  };

  const handleBookingSubmit = async () => {
    if (!agreedToTerms) {
      error('Please accept the terms and conditions');
      return;
    }

    if (paymentMethod === 'online') {
      // Proceed to payment for online bookings
      setStep(3);
    } else {
      // For cash bookings, create booking directly
      setLoading(true);
      try {
        const bookingData: BookingRequest = {
          turfId: turf.id,
          customerId: 'current_user_id',
          slotStart: new Date(selectedDate.setHours(parseInt(selectedSlot.startTime.split(':')[0]))),
          slotEnd: new Date(selectedDate.setHours(parseInt(selectedSlot.endTime.split(':')[0]))),
          customerDetails,
          paymentMethod,
          notes: specialRequests,
        };

        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockBookingId = `book_${Date.now()}`;
        success('Booking confirmed! Pay remaining amount at the turf.');
        onBookingComplete(mockBookingId);
      } catch (err) {
        error('Failed to create booking. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePaymentSuccess = (paymentDetails: any) => {
    success('Payment completed successfully!');
    const mockBookingId = `book_${Date.now()}`;
    onBookingComplete(mockBookingId);
  };

  const handlePaymentFailure = (errorMessage: string) => {
    error(`Payment failed: ${errorMessage}`);
    setStep(2); // Go back to payment method selection
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      const formatted = cleaned.replace(/(\d{5})(\d{5})/, '$1 $2');
      return cleaned.length > 5 ? `+91 ${formatted}` : `+91 ${cleaned}`;
    }
    return customerDetails.phone;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Booking Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-foreground">{turf.name}</h3>
              <p className="text-sm text-muted-foreground">{turf.location.address}</p>
              <p className="text-sm text-muted-foreground">
                Sports: {turf.sports.join(', ')}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{format(selectedDate, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>{selectedSlot.startTime} - {selectedSlot.endTime}</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Base Price ({duration} hours)</span>
              <span>₹{basePrice}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>GST (18%)</span>
              <span>₹{tax}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Customer Details */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: formatPhoneNumber(e.target.value) }))}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onCancel} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCustomerDetailsSubmit} className="flex-1">
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Payment & Confirmation */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value) => setPaymentMethod(value as 'online' | 'cash' | 'upi')}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex-1 cursor-pointer">
                    <div>
                      <div className="font-medium">Pay Online (Recommended)</div>
                      <div className="text-sm text-muted-foreground">
                        Pay full amount now - Instant confirmation
                      </div>
                    </div>
                  </Label>
                  <div className="text-right">
                    <div className="font-semibold">₹{totalAmount}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex-1 cursor-pointer">
                    <div>
                      <div className="font-medium">Pay at Turf</div>
                      <div className="text-sm text-muted-foreground">
                        Pay 50% advance online, rest at turf
                      </div>
                    </div>
                  </Label>
                  <div className="text-right">
                    <div className="font-semibold">₹{advanceAmount}</div>
                    <div className="text-xs text-muted-foreground">advance</div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Terms & Confirmation */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    I agree to the Terms & Conditions and Privacy Policy
                  </Label>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)} 
                    className="flex-1"
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleBookingSubmit} 
                    className="flex-1"
                    disabled={loading || !agreedToTerms}
                  >
                    {loading ? 'Processing...' : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Confirm Booking
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Payment Gateway */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PaymentGateway
            amount={paymentMethod === 'cash' ? advanceAmount : totalAmount}
            currency="INR"
            bookingId={`temp_${Date.now()}`}
            customerDetails={customerDetails}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentFailure={handlePaymentFailure}
            onCancel={() => setStep(2)}
          />
        </motion.div>
      )}
    </div>
  );
};

export default BookingForm;