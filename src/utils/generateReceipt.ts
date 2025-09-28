import { Booking, Receipt } from '@/types';
import { formatPrice, calculateBookingTotal } from './formatPrice';

/**
 * Generate a mock receipt for a booking
 */
export const generateReceipt = (booking: Booking): Receipt => {
  const hours = (booking.slotEnd.getTime() - booking.slotStart.getTime()) / (1000 * 60 * 60);
  const basePrice = booking.price / hours;
  const billing = calculateBookingTotal(basePrice, hours);
  
  const receipt: Receipt = {
    id: `rcpt_${Date.now()}`,
    bookingId: booking.id,
    amount: billing.subtotal,
    tax: billing.tax,
    total: billing.total,
    generatedAt: new Date(),
    downloadUrl: generateMockPDF(booking, billing),
  };
  
  return receipt;
};

/**
 * Generate mock PDF content (returns base64 data URL)
 */
const generateMockPDF = (booking: Booking, billing: any): string => {
  const receiptData = {
    businessName: 'PlayNest',
    businessAddress: 'Sports Booking Platform',
    receiptNumber: `RCPT-${booking.id.slice(-6).toUpperCase()}`,
    date: new Date().toLocaleDateString('en-IN'),
    time: new Date().toLocaleTimeString('en-IN'),
    customer: booking.customerDetails,
    turf: booking.turfDetails,
    booking: {
      id: booking.id,
      date: booking.slotStart.toLocaleDateString('en-IN'),
      time: `${booking.slotStart.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })} - ${booking.slotEnd.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`,
      duration: `${(booking.slotEnd.getTime() - booking.slotStart.getTime()) / (1000 * 60 * 60)} hours`,
    },
    billing,
    qrCode: booking.qrCode,
  };
  
  // Mock PDF generation - in real app, use libraries like jsPDF or PDFKit
  const pdfContent = btoa(JSON.stringify(receiptData, null, 2));
  return `data:application/pdf;base64,${pdfContent}`;
};

/**
 * Download receipt PDF
 */
export const downloadReceipt = (receipt: Receipt, filename?: string) => {
  const link = document.createElement('a');
  link.href = receipt.downloadUrl;
  link.download = filename || `receipt-${receipt.id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate receipt email content
 */
export const generateReceiptEmail = (booking: Booking, receipt: Receipt) => {
  return {
    to: booking.customerDetails.email,
    subject: `PlayNest Booking Receipt - ${booking.turfDetails.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #22C55E;">Booking Confirmed! 🏀</h2>
        <p>Dear ${booking.customerDetails.name},</p>
        <p>Your booking has been confirmed. Here are the details:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>${booking.turfDetails.name}</h3>
          <p><strong>Date:</strong> ${booking.slotStart.toLocaleDateString('en-IN')}</p>
          <p><strong>Time:</strong> ${booking.slotStart.toLocaleTimeString('en-IN')} - ${booking.slotEnd.toLocaleTimeString('en-IN')}</p>
          <p><strong>Sports:</strong> ${booking.turfDetails.sports.join(', ')}</p>
          <p><strong>Total Amount:</strong> ${formatPrice(receipt.total)}</p>
        </div>
        
        <p>Please save this receipt for your records. Show the QR code below at the venue for check-in:</p>
        <p><strong>QR Code:</strong> ${booking.qrCode}</p>
        
        <p>Thank you for choosing PlayNest!</p>
        <p style="color: #6b7280; font-size: 14px;">This is an automated email. Please do not reply.</p>
      </div>
    `,
  };
};