import { format } from 'date-fns';
import { Download, Printer, Share2, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Booking } from '@/types/booking';

interface BookingReceiptProps {
  booking: Booking;
  onDownload?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
}

const BookingReceipt = ({ booking, onDownload, onPrint, onShare }: BookingReceiptProps) => {
  const tax = Math.round(booking.price * 0.18);
  const baseAmount = booking.price - tax;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="print:shadow-none">
        <CardHeader className="text-center border-b">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-primary">PlayNest</div>
            <div className="text-sm text-muted-foreground">Sports Turf Booking Platform</div>
            <div className="text-lg font-semibold">Booking Receipt</div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium">Receipt ID:</div>
              <div className="font-mono text-xs">{booking.receiptId}</div>
            </div>
            <div>
              <div className="font-medium">Booking ID:</div>
              <div className="font-mono text-xs">{booking.id}</div>
            </div>
            <div>
              <div className="font-medium">Date Issued:</div>
              <div>{format(booking.createdAt, 'MMM d, yyyy HH:mm')}</div>
            </div>
            <div>
              <div className="font-medium">Status:</div>
              <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                {booking.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Customer Details */}
          <div>
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">Name:</div>
                <div>{booking.customerDetails.name}</div>
              </div>
              <div>
                <div className="font-medium">Email:</div>
                <div>{booking.customerDetails.email}</div>
              </div>
              <div>
                <div className="font-medium">Phone:</div>
                <div>{booking.customerDetails.phone}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Turf Details */}
          <div>
            <h3 className="font-semibold mb-3">Turf Information</h3>
            <div className="space-y-2">
              <div className="font-medium text-lg">{booking.turfDetails.name}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {booking.turfDetails.address}
              </div>
              <div className="flex flex-wrap gap-2">
                {booking.turfDetails.sports.map((sport, index) => (
                  <Badge key={index} variant="outline">{sport}</Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Details */}
          <div>
            <h3 className="font-semibold mb-3">Booking Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">Date:</span>
                  <span>{format(booking.slotStart, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium">Time:</span>
                  <span>
                    {format(booking.slotStart, 'HH:mm')} - {format(booking.slotEnd, 'HH:mm')}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Duration:</span>
                  <span className="ml-2">
                    {Math.round((booking.slotEnd.getTime() - booking.slotStart.getTime()) / (1000 * 60 * 60))} hours
                  </span>
                </div>
                <div>
                  <span className="font-medium">Payment Method:</span>
                  <span className="ml-2 capitalize">{booking.paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Breakdown */}
          <div>
            <h3 className="font-semibold mb-3">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Base Amount:</span>
                <span>₹{baseAmount}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>GST (18%):</span>
                <span>₹{tax}</span>
              </div>
              {booking.advancePaid < booking.price && (
                <>
                  <div className="flex justify-between text-sm">
                    <span>Advance Paid:</span>
                    <span>₹{booking.advancePaid}</span>
                  </div>
                  <div className="flex justify-between text-sm text-orange-600">
                    <span>Remaining Amount:</span>
                    <span>₹{booking.price - booking.advancePaid}</span>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount:</span>
                <span>₹{booking.price}</span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          {booking.qrCode && (
            <>
              <Separator />
              <div className="text-center">
                <h3 className="font-semibold mb-3">Check-in QR Code</h3>
                <div className="bg-white p-4 border rounded-lg inline-block">
                  <div className="w-32 h-32 bg-gray-100 flex items-center justify-center text-xs text-gray-500 border">
                    {booking.qrCode}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Present this QR code at the turf for check-in
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Terms */}
          <div className="text-xs text-muted-foreground">
            <h4 className="font-medium mb-2">Terms & Conditions:</h4>
            <ul className="space-y-1">
              <li>• Cancellation allowed up to 2 hours before the booked slot</li>
              <li>• Refunds will be processed within 5-7 business days</li>
              <li>• Please carry a valid ID proof for verification</li>
              <li>• Management reserves the right to cancel in case of weather conditions</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6 print:hidden">
        {onDownload && (
          <Button onClick={onDownload} variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        )}
        {onPrint && (
          <Button onClick={() => window.print()} variant="outline" className="flex-1">
            <Printer className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>
        )}
        {onShare && (
          <Button onClick={onShare} variant="outline" className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookingReceipt;