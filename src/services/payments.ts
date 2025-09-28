import { PaymentDetails, ApiResponse } from '@/types';
import { apiClient } from './api';

// Payment processing service with Razorpay integration
// Backend Integration: Connect to Razorpay API and payments table
export class PaymentService {
  /**
   * Initialize payment order with Razorpay
   * Backend: POST /payments/initiate - Create Razorpay order and store in payments table
   * Returns order_id needed for Razorpay checkout
   */
  async initiatePayment(paymentData: {
    amount: number;          // Payment amount in rupees
    currency: string;        // Currency code (INR)
    bookingId: string;      // Associated booking ID
    customerEmail: string;   // Customer email for receipt
    customerPhone: string;   // Customer phone for OTP
  }): Promise<ApiResponse<{ orderId: string; keyId: string }>> {
    try {
      // Backend: Create Razorpay order and store payment record
      await apiClient.post('/payments/initiate', paymentData);
      
      // Mock order creation - REPLACE WITH RAZORPAY API RESPONSE
      const orderId = `order_${Date.now()}`;           // Razorpay generates actual order_id
      const keyId = 'rzp_test_mock_key';               // Your Razorpay API key from dashboard
      
      return {
        data: { orderId, keyId },                      // Frontend needs these for checkout
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      // Handle payment initiation failures
      throw {
        code: 'PAYMENT_INIT_FAILED',
        message: 'Failed to initiate payment',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Verify payment (mock verification)
   */
  async verifyPayment(verificationData: {
    orderId: string;
    paymentId: string;
    signature: string;
    bookingId: string;
  }): Promise<ApiResponse<PaymentDetails>> {
    try {
      await apiClient.post('/payments/verify', verificationData);
      
      // Mock payment verification (90% success rate for testing)
      const isSuccess = Math.random() > 0.1;
      
      if (!isSuccess) {
        throw new Error('Payment verification failed');
      }
      
      const paymentDetails: PaymentDetails = {
        orderId: verificationData.orderId,
        amount: 1200, // Mock amount
        currency: 'INR',
        method: 'online',
        status: 'success',
        transactionId: verificationData.paymentId,
        gateway: 'razorpay',
      };
      
      return {
        data: paymentDetails,
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      throw {
        code: 'PAYMENT_VERIFICATION_FAILED',
        message: 'Payment verification failed',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Process refund
   */
  async processRefund(refundData: {
    paymentId: string;
    amount: number;
    reason: string;
  }): Promise<ApiResponse<{ refundId: string; status: string }>> {
    try {
      await apiClient.post('/payments/refund', refundData);
      
      const refundId = `rfnd_${Date.now()}`;
      
      return {
        data: {
          refundId,
          status: 'processed',
        },
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      throw {
        code: 'REFUND_FAILED',
        message: 'Failed to process refund',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(orderId: string): Promise<ApiResponse<PaymentDetails>> {
    try {
      await apiClient.get(`/payments/${orderId}/status`);
      
      // Mock payment status
      const paymentDetails: PaymentDetails = {
        orderId,
        amount: 1200,
        currency: 'INR',
        method: 'online',
        status: 'success',
        transactionId: `pay_${Date.now()}`,
        gateway: 'razorpay',
      };
      
      return {
        data: paymentDetails,
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      throw {
        code: 'PAYMENT_STATUS_FAILED',
        message: 'Failed to fetch payment status',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Mock Razorpay checkout options
   */
  getRazorpayOptions(orderData: {
    orderId: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    description: string;
  }) {
    return {
      key: 'rzp_test_mock_key',
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
   * Simulate Razorpay payment popup
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
            razorpay_payment_id: `pay_${Date.now()}`,
            razorpay_order_id: options.order_id,
            razorpay_signature: `signature_${Date.now()}`,
          });
        } else {
          reject(new Error('Payment failed'));
        }
      }, 2000);
    });
  }
}

export const paymentService = new PaymentService();