import { motion } from 'framer-motion';
import { Calendar, DollarSign, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardNav: React.FC<DashboardNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'bookings',
      label: 'Bookings',
      icon: Calendar,
      description: 'Manage your turf bookings'
    },
    {
      id: 'pricing',
      label: 'Pricing',
      icon: DollarSign,
      description: 'Set and update your rates'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'View performance insights'
    }
  ];

  return (
    <div className="border-b border-border">
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              )}
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardNav;