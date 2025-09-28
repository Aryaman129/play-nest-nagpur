import { motion } from 'framer-motion';
import { FaFootballBall } from 'react-icons/fa';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className={`${sizeClasses[size]} text-primary`}
      >
        <FaFootballBall />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;