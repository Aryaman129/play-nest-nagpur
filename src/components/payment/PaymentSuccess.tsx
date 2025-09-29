import { motion } from 'framer-motion';
import { CheckCircle, Download, Calendar, Clock, MapPin, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Booking, PaymentDetails } from '@/types/booking';

interface PaymentSuccessProps {
  booking: Booking;
  paymentDetails: PaymentDetails;
  onDownloadReceipt: () => void;
  onViewBookings: () => void;
}

const PaymentSuccess = ({ 
  booking, 
  paymentDetails, 
  onDownloadReceipt, 
  onViewBookings 
}: PaymentSuccessProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Animation with Sports Theme */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="text-center"
      >
        {/* Animated Sports Success Icon */}
        <motion.div
          initial={{ rotateY: 180, scale: 0 }}
          animate={{ rotateY: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-24 h-24 mx-auto mb-4 text-6xl"
        >
          ⚽
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-green-600 mb-2">🏆 Booking Confirmed!</h1>
          <p className="text-muted-foreground text-lg">Get ready to play! Your turf is booked successfully</p>
        </motion.div>
      </motion.div>

      {/* Booking Details Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Booking Confirmation
            </CardTitle>
            <CardDescription>
              Booking ID: <span className="font-mono text-foreground">{booking.id}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Turf Details */}
            <div>
              <h3 className="font-semibold text-lg">{booking.turfDetails.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                {booking.turfDetails.address}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {booking.turfDetails.sports.map((sport, index) => (
                  <Badge key={index} variant="secondary">{sport}</Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Schedule Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Date & Time</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{format(booking.slotStart, 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>
                      {format(booking.slotStart, 'HH:mm')} - {format(booking.slotEnd, 'HH:mm')}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Customer Details</h4>
                <div className="space-y-1 text-sm">
                  <div>{booking.customerDetails.name}</div>
                  <div className="text-muted-foreground">{booking.customerDetails.email}</div>
                  <div className="text-muted-foreground">{booking.customerDetails.phone}</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Details */}
            <div>
              <h4 className="font-medium mb-2">Payment Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <div className="font-semibold">₹{booking.price}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Payment Method:</span>
                  <div className="font-medium capitalize">{booking.paymentMethod}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <div className="font-mono text-xs">{paymentDetails.transactionId}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {paymentDetails.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            {booking.qrCode && (
              <>
                <Separator />
                <div className="text-center">
                  <h4 className="font-medium mb-2 flex items-center justify-center gap-2">
                    <QrCode className="w-4 h-4" />
                    Check-in QR Code
                  </h4>
                  <div className="bg-white p-4 rounded-lg inline-block border">
                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                      QR Code: {booking.qrCode}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Show this QR code at the turf for quick check-in
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Button onClick={onDownloadReceipt} variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download Receipt
        </Button>
        <Button onClick={onViewBookings} className="w-full">
          View My Bookings
        </Button>
      </motion.div>

      {/* Important Notes */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">Important Notes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Please arrive 15 minutes before your scheduled time</li>
              <li>• Carry a valid ID proof for verification</li>
              <li>• Cancellation allowed up to 2 hours before the slot</li>
              <li>• Contact support for any queries: +91 9876543210</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;