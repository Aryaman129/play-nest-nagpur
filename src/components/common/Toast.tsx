import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export const useAppToast = () => {
  const { toast } = useToast();

  const showToast = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    description?: string
  ) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toast({
      title: `${icons[type]} ${title}`,
      description,
      duration: type === 'error' ? 5000 : 3000,
    });
  };

  const success = (title: string, description?: string) => showToast('success', title, description);
  const error = (title: string, description?: string) => showToast('error', title, description);
  const warning = (title: string, description?: string) => showToast('warning', title, description);
  const info = (title: string, description?: string) => showToast('info', title, description);

  const bookingSuccess = () => {
    toast({
      title: "🏀 Booking Confirmed!",
      description: 'Your turf has been booked successfully. Check your profile for details.',
      duration: 4000,
    });
  };

  return { success, error, warning, info, bookingSuccess };
};

export default useAppToast;