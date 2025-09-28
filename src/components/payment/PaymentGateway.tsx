import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Lock, Smartphone, Wallet, QrCode, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppToast } from '@/components/common/Toast';
import { paymentService } from '@/services/payments';
import { PaymentDetails } from '@/types/booking';

interface PaymentGatewayProps {
  amount: number;
  currency: string;
  bookingId: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  onPaymentSuccess: (paymentDetails: PaymentDetails) => void;
  onPaymentFailure: (error: string) => void;
  onCancel: () => void;
}

const PaymentGateway = ({
  amount,
  currency,
  bookingId,
  customerDetails,
  onPaymentSuccess,
  onPaymentFailure,
  onCancel
}: PaymentGatewayProps) => {
  const { success, error, info } = useAppToast();
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'methods' | 'processing' | 'success' | 'failed'>('methods');
  const [orderId, setOrderId] = useState<string>('');

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
      popular: true,
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'PhonePe, Paytm, GPay, BHIM',
      popular: true,
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Wallet,
      description: 'All major banks supported',
      popular: false,
    },
    {
      id: 'wallet',
      name: 'Digital Wallets',
      icon: QrCode,
      description: 'Paytm, PhonePe, Amazon Pay',
      popular: false,
    },
  ];

  const initiatePayment = async (method: string) => {
    setLoading(true);
    setPaymentStep('processing');
    
    try {
      // Step 1: Create payment order
      const orderResponse = await paymentService.initiatePayment({
        amount,
        currency,
        bookingId,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
      });

      setOrderId(orderResponse.data.orderId);
      info('Payment order created successfully');

      // Step 2: Get Razorpay options
      const razorpayOptions = paymentService.getRazorpayOptions({
        orderId: orderResponse.data.orderId,
        amount,
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
        description: `Turf booking payment for ${bookingId}`,
      });

      // Step 3: Simulate Razorpay payment popup
      info('Opening payment gateway...');
      const paymentResult = await paymentService.simulateRazorpayPayment(razorpayOptions);

      // Step 4: Verify payment
      const verificationResponse = await paymentService.verifyPayment({
        orderId: orderResponse.data.orderId,
        paymentId: paymentResult.razorpay_payment_id,
        signature: paymentResult.razorpay_signature,
        bookingId,
      });

      setPaymentStep('success');
      success('Payment completed successfully!');
      onPaymentSuccess(verificationResponse.data);

    } catch (err: any) {
      setPaymentStep('failed');
      const errorMessage = err.message || 'Payment failed. Please try again.';
      error(errorMessage);
      onPaymentFailure(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentMethods = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Choose Payment Method</h3>
        <p className="text-muted-foreground">Secure payment powered by Razorpay</p>
      </div>

      <div className="grid gap-3">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <Button
              key={method.id}
              variant="outline"
              className="justify-start h-auto p-4 relative"
              onClick={() => initiatePayment(method.id)}
              disabled={loading}
            >
              <div className="flex items-center gap-4 w-full">
                <IconComponent className="w-6 h-6 text-primary" />
                <div className="text-left flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {method.name}
                    {method.popular && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{method.description}</div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your payment is secured with 256-bit SSL encryption. We never store your card details.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 mx-auto"
      >
        <Lock className="w-16 h-16 text-primary" />
      </motion.div>
      <h3 className="text-lg font-semibold">Processing Payment...</h3>
      <p className="text-muted-foreground">Please wait while we process your payment securely</p>
      <div className="text-sm text-muted-foreground">
        Order ID: {orderId}
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      </motion.div>
      <h3 className="text-lg font-semibold text-green-600">Payment Successful!</h3>
      <p className="text-muted-foreground">Your booking has been confirmed</p>
    </div>
  );

  const renderFailed = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <span className="text-2xl">❌</span>
      </div>
      <h3 className="text-lg font-semibold text-red-600">Payment Failed</h3>
      <p className="text-muted-foreground">Please try again or choose a different payment method</p>
      <Button onClick={() => setPaymentStep('methods')} variant="outline">
        Try Again
      </Button>
    </div>
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Gateway
        </CardTitle>
        <CardDescription>
          Amount to pay: <span className="font-semibold text-foreground">₹{amount}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {paymentStep === 'methods' && renderPaymentMethods()}
        {paymentStep === 'processing' && renderProcessing()}
        {paymentStep === 'success' && renderSuccess()}
        {paymentStep === 'failed' && renderFailed()}

        {(paymentStep === 'methods' || paymentStep === 'failed') && (
          <div className="mt-6">
            <Button variant="ghost" onClick={onCancel} className="w-full">
              Cancel Payment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentGateway;