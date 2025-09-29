import { PaymentDetails } from '../types/booking';
import { supabase } from './api';

// Payment processing service with Razorpay integration
// Backend Integration: Connect to Razorpay API and store payment records in Supabase
export class PaymentService {
  /**
   * Initialize payment order with Razorpay
   * Creates a payment record in Supabase and returns order details
   */
  async initiatePayment(paymentData: {
    amount: number;          // Payment amount in rupees
    currency: string;        // Currency code (INR)
    bookingId: string;      // Associated booking ID
    customerEmail: string;   // Customer email for receipt
    customerPhone: string;   // Customer phone for OTP
  }): Promise<{ orderId: string; keyId: string }> {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Generate order ID (in production, this would be from Razorpay)
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store payment record in Supabase
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert([{
          order_id: orderId,
          booking_id: paymentData.bookingId,
          user_id: user.id,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: 'pending',
          gateway: 'razorpay',
          customer_email: paymentData.customerEmail,
          customer_phone: paymentData.customerPhone
        }])
        .select('*')
        .single();

      if (paymentError) {
        throw new Error(`Failed to create payment record: ${paymentError.message}`);
      }

      // In production, use actual Razorpay key from environment
      const keyId = process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock_key';
      
      return { orderId, keyId };
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  }

  /**
   * Verify payment and update records
   */
  async verifyPayment(verificationData: {
    orderId: string;
    paymentId: string;
    signature: string;
    bookingId: string;
  }): Promise<PaymentDetails> {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // In production, verify signature with Razorpay
      // For now, simulate verification (90% success rate for testing)
      const isSuccess = Math.random() > 0.1;
      
      if (!isSuccess) {
        throw new Error('Payment verification failed');
      }

      // Update payment record
      const { data: payment, error: updateError } = await supabase
        .from('payments')
        .update({
          payment_id: verificationData.paymentId,
          signature: verificationData.signature,
          status: 'success',
          verified_at: new Date().toISOString()
        })
        .eq('order_id', verificationData.orderId)
        .eq('user_id', user.id)
        .select('*')
        .single();

      if (updateError) {
        throw new Error(`Failed to update payment: ${updateError.message}`);
      }

      // Update booking payment status
      await supabase
        .from('bookings')
        .update({
          payment_status: 'completed',
          payment_id: verificationData.paymentId
        })
        .eq('id', verificationData.bookingId);

      const paymentDetails: PaymentDetails = {
        orderId: verificationData.orderId,
        amount: payment.amount,
        currency: payment.currency,
        method: 'online',
        status: 'success',
        transactionId: verificationData.paymentId,
        gateway: 'razorpay',
      };
      
      return paymentDetails;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  /**
   * Process refund
   */
  async processRefund(refundData: {
    paymentId: string;
    amount: number;
    reason: string;
  }): Promise<{ refundId: string; status: string }> {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Generate refund ID (in production, this would be from Razorpay)
      const refundId = `rfnd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create refund record
      const { error: refundError } = await supabase
        .from('refunds')
        .insert([{
          refund_id: refundId,
          payment_id: refundData.paymentId,
          user_id: user.id,
          amount: refundData.amount,
          reason: refundData.reason,
          status: 'processed',
          processed_at: new Date().toISOString()
        }]);

      if (refundError) {
        throw new Error(`Failed to create refund record: ${refundError.message}`);
      }

      // Update payment status
      await supabase
        .from('payments')
        .update({ status: 'refunded' })
        .eq('payment_id', refundData.paymentId);
      
      return {
        refundId,
        status: 'processed',
      };
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(orderId: string): Promise<PaymentDetails> {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const { data: payment, error } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', orderId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        throw new Error(`Failed to fetch payment status: ${error.message}`);
      }

      if (!payment) {
        throw new Error('Payment not found');
      }

      const paymentDetails: PaymentDetails = {
        orderId: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        method: 'online',
        status: payment.status,
        transactionId: payment.payment_id,
        gateway: payment.gateway,
      };
      
      return paymentDetails;
    } catch (error) {
      console.error('Error fetching payment status:', error);
      throw error;
    }
  }

  /**
   * Get Razorpay checkout options
   */
  getRazorpayOptions(orderData: {
    orderId: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    description: string;
  }) {
    const keyId = process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock_key';
    
    return {
      key: keyId,
      amount: orderData.amount * 100, // Convert to paise
      currency: 'INR',
      name: 'PlayNest',
      description: orderData.description,
      order_id: orderData.orderId,
      prefill: {
        name: orderData.customerName,
        email: orderData.customerEmail,
        contact: orderData.customerPhone,
      },
      theme: {
        color: '#22C55E',
      },
      modal: {
        ondismiss: () => {
          console.log('Payment popup closed');
        },
      },
    };
  }

  /**
   * Simulate Razorpay payment popup (for testing)
   */
  async simulateRazorpayPayment(options: any): Promise<{
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }> {
    return new Promise((resolve, reject) => {
      // Simulate payment processing time
      setTimeout(() => {
        // 90% success rate for testing
        if (Math.random() > 0.1) {
          resolve({
            razorpay_payment_id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            razorpay_order_id: options.order_id,
            razorpay_signature: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          });
        } else {
          reject(new Error('Payment failed'));
        }
      }, 2000);
    });
  }

  /**
   * Get user's payment history
   */
  async getPaymentHistory(): Promise<PaymentDetails[]> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch payment history: ${error.message}`);
      }

      return payments?.map(payment => ({
        orderId: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        method: 'online',
        status: payment.status,
        transactionId: payment.payment_id,
        gateway: payment.gateway,
      })) || [];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();