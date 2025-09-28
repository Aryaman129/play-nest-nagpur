/**
 * Format price in Indian Rupees
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format price without currency symbol
 */
export const formatPriceNumber = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format price range
 */
export const formatPriceRange = (min: number, max: number): string => {
  if (min === max) {
    return formatPrice(min);
  }
  return `${formatPrice(min)} - ${formatPrice(max)}`;
};

/**
 * Calculate booking total with taxes
 */
export const calculateBookingTotal = (basePrice: number, hours: number, taxRate: number = 0.18) => {
  const subtotal = basePrice * hours;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  return {
    subtotal,
    tax,
    total,
    formattedSubtotal: formatPrice(subtotal),
    formattedTax: formatPrice(tax),
    formattedTotal: formatPrice(total),
  };
};