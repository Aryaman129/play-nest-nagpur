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
      success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      error: <XCircle className="w-5 h-5 text-red-500" />,
      warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
      info: <Info className="w-5 h-5 text-blue-500" />
    };

    toast({
      title: (
        <div className="flex items-center gap-2">
          {icons[type]}
          {title}
        </div>
      ),
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
      title: (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2"
        >
          <motion.div
            initial={{ rotate: -45 }}
            animate={{ rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            🏀
          </motion.div>
          Booking Confirmed!
        </motion.div>
      ),
      description: 'Your turf has been booked successfully. Check your profile for details.',
      duration: 4000,
    });
  };

  return { success, error, warning, info, bookingSuccess };
};

export default useAppToast;