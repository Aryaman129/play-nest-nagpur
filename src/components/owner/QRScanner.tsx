// QR Scanner Component for Owner Check-in Verification
// **BACKEND INTEGRATION**: Connects to booking verification API

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Scan, CheckCircle, XCircle, User, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppToast } from '@/components/common/Toast';
import { bookingService } from '@/services/bookings';
import { Booking } from '@/types/booking';
import { format } from 'date-fns';

interface QRScannerProps {
  onVerificationSuccess?: (booking: Booking) => void;
  onVerificationError?: (error: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({
  onVerificationSuccess,
  onVerificationError
}) => {
  const [qrCode, setQrCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [verifiedBooking, setVerifiedBooking] = useState<Booking | null>(null);
  const [isCameraSupported, setIsCameraSupported] = useState(false);
  const { success, error } = useAppToast();

  // Check camera support on component mount
  useEffect(() => {
    const checkCameraSupport = async () => {
      try {
        // **BACKEND INTEGRATION**: Check device capabilities
        // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // setIsCameraSupported(true);
        // stream.getTracks().forEach(track => track.stop());
        
        // Mock camera support check for now
        setIsCameraSupported('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices);
      } catch (err) {
        setIsCameraSupported(false);
        console.log('Camera not available:', err);
      }
    };

    checkCameraSupport();
  }, []);

  // Manual QR code verification
  const handleManualVerify = async () => {
    if (!qrCode.trim()) {
      error('Please enter a QR code');
      return;
    }

    setIsScanning(true);

    try {
      // **BACKEND INTEGRATION**: Verify QR code with booking service
      // const response = await bookingService.verifyQRCode(qrCode);
      
      // Mock verification - REPLACE WITH BACKEND CALL
      const mockBooking: Booking = {
        id: 'book_001',
        customerId: '1',
        turfId: '1',
        slotStart: new Date(),
        slotEnd: new Date(Date.now() + 2 * 60 * 60 * 1000),
        price: 1200,
        advancePaid: 600,
        status: 'confirmed',
        receiptId: 'rcpt_001',
        paymentMethod: 'online',
        createdAt: new Date(),
        updatedAt: new Date(),
        customerDetails: {
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+91 9876543210',
        },
        turfDetails: {
          name: 'Green Valley Sports Complex',
          address: 'Sector 18, Near Metro Station',
          sports: ['Football'],
        },
        qrCode: qrCode,
      };

      setVerifiedBooking(mockBooking);
      success('QR Code verified successfully!');
      onVerificationSuccess?.(mockBooking);
    } catch (err) {
      const errorMessage = 'Invalid or expired QR code';
      error(errorMessage);
      onVerificationError?.(errorMessage);
    } finally {
      setIsScanning(false);
    }
  };

  // Camera-based scanning (placeholder for future mobile implementation)
  const handleCameraScan = async () => {
    try {
      // **MOBILE INTEGRATION**: Implement camera QR scanning
      // This would be implemented with react-native-camera or similar for mobile
      error('Camera scanning will be available in mobile app');
      
      // For web, we can use libraries like html5-qrcode
      // const html5QrCode = new Html5Qrcode("qr-reader");
      // const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      //   setQrCode(decodedText);
      //   handleManualVerify();
      // };
      // await html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
    } catch (err) {
      error('Camera access denied or not supported');
    }
  };

  // Clear verification results
  const handleClearResults = () => {
    setVerifiedBooking(null);
    setQrCode('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <QrCode className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">QR Code Scanner</h2>
        <p className="text-muted-foreground">
          Verify customer bookings by scanning their QR code
        </p>
      </motion.div>

      {/* Scanner Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5" />
              Scan QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Manual Input */}
            <div className="space-y-3">
              <label htmlFor="qr-input" className="text-sm font-medium">
                Enter QR Code Manually
              </label>
              <div className="flex gap-3">
                <Input
                  id="qr-input"
                  placeholder="Enter QR code (e.g., QR_book_001_verify)"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  disabled={isScanning}
                  aria-label="QR code input field"
                />
                <Button 
                  onClick={handleManualVerify}
                  disabled={isScanning || !qrCode.trim()}
                  className="min-w-[100px]"
                  aria-label="Verify QR code"
                >
                  {isScanning ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
            </div>

            {/* Camera Scan Option */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleCameraScan}
              disabled={!isCameraSupported || isScanning}
              className="w-full"
              aria-label="Scan with camera"
            >
              <Scan className="w-4 h-4 mr-2" />
              {isCameraSupported ? 'Scan with Camera' : 'Camera Not Available'}
            </Button>

            {/* Camera support notice */}
            <p className="text-xs text-muted-foreground text-center">
              {isCameraSupported 
                ? 'Camera scanning available on supported devices'
                : 'For mobile camera scanning, use the PlayNest mobile app'
              }
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Verification Result */}
      {verifiedBooking && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                Booking Verified Successfully
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Customer Details</h4>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium">{verifiedBooking.customerDetails.name}</p>
                        <p className="text-sm text-muted-foreground">{verifiedBooking.customerDetails.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Booking Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{format(verifiedBooking.slotStart, 'EEEE, MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>
                          {format(verifiedBooking.slotStart, 'HH:mm')} - {format(verifiedBooking.slotEnd, 'HH:mm')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{verifiedBooking.turfDetails.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Payment Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Amount:</span>
                        <span className="font-medium">₹{verifiedBooking.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Advance Paid:</span>
                        <span className="font-medium">₹{verifiedBooking.advancePaid}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Remaining:</span>
                        <span className="font-medium text-orange-600">
                          ₹{verifiedBooking.price - verifiedBooking.advancePaid}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Badge variant={verifiedBooking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {verifiedBooking.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Sports Info */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Sports</h4>
                <div className="flex flex-wrap gap-2">
                  {verifiedBooking.turfDetails.sports.map((sport, index) => (
                    <Badge key={index} variant="outline">{sport}</Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="default"
                  onClick={() => {
                    // **BACKEND INTEGRATION**: Mark booking as checked in
                    success('Customer checked in successfully');
                  }}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Check-in
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleClearResults}
                  className="flex-1"
                >
                  Scan Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              Quick Tips
            </h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Ask customers to show their QR code from the booking confirmation</li>
              <li>• Verify customer identity by checking their phone number</li>
              <li>• For invalid codes, ask customers to check their email for the correct code</li>
              <li>• Contact support if you encounter repeated verification issues</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default QRScanner;