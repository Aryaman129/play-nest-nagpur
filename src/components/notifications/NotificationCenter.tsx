import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  Calendar, 
  CreditCard, 
  Star, 
  AlertTriangle, 
  Gift,
  Clock,
  CheckCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format, formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'review' | 'promotion' | 'reminder' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter = ({ isOpen, onClose }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'booking',
        title: 'Booking Confirmed',
        message: 'Your booking for Green Valley Sports Complex has been confirmed for tomorrow at 6:00 PM',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        actionUrl: '/bookings',
      },
      {
        id: '2',
        type: 'payment',
        title: 'Payment Successful',
        message: 'Payment of ₹1,200 has been processed successfully for booking #B001',
        isRead: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
      {
        id: '3',
        type: 'reminder',
        title: 'Upcoming Booking Reminder',
        message: 'Your turf booking is scheduled to start in 2 hours. Don\'t forget to bring your ID!',
        isRead: true,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
      {
        id: '4',
        type: 'review',
        title: 'Review Your Experience',
        message: 'How was your recent booking at Champions Arena? Share your feedback to help others.',
        isRead: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        actionUrl: '/bookings?review=true',
      },
      {
        id: '5',
        type: 'promotion',
        title: 'Weekend Special Offer!',
        message: 'Get 20% off on all weekend bookings. Use code WEEKEND20. Valid until Sunday.',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        id: '6',
        type: 'system',
        title: 'Maintenance Notice',
        message: 'Scheduled maintenance on Sunday 2:00 AM - 4:00 AM. Some features may be unavailable.',
        isRead: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    const iconMap = {
      booking: Calendar,
      payment: CreditCard,
      review: Star,
      promotion: Gift,
      reminder: Clock,
      system: AlertTriangle,
    };
    return iconMap[type] || Bell;
  };

  const getNotificationColor = (type: Notification['type']) => {
    const colorMap = {
      booking: 'text-blue-500',
      payment: 'text-green-500',
      review: 'text-yellow-500',
      promotion: 'text-purple-500',
      reminder: 'text-orange-500',
      system: 'text-gray-500',
    };
    return colorMap[type] || 'text-gray-500';
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const filteredNotifications = notifications.filter(notification =>
    filter === 'all' || !notification.isRead
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md h-full bg-background shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="h-full rounded-none border-l border-t-0 border-r-0 border-b-0">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                  className="flex-1"
                >
                  All ({notifications.length})
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                  className="flex-1"
                >
                  Unread ({unreadCount})
                </Button>
              </div>

              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="w-full mt-2"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              )}
            </CardHeader>

            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-200px)]">
                {filteredNotifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-medium mb-1">No notifications</h3>
                    <p className="text-sm">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications.map((notification, index) => {
                      const IconComponent = getNotificationIcon(notification.type);
                      const iconColor = getNotificationColor(notification.type);

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 hover:bg-muted/80 cursor-pointer relative border-b ${
                            !notification.isRead ? 'bg-primary/10 border-l-4 border-l-primary' : 'bg-card'
                          }`}
                          onClick={() => {
                            markAsRead(notification.id);
                            if (notification.actionUrl) {
                              // Navigate to action URL
                              console.log('Navigate to:', notification.actionUrl);
                            }
                          }}
                        >
                          <div className="flex gap-3">
                            <div className={`mt-1 ${iconColor}`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-medium text-sm line-clamp-1">
                                  {notification.title}
                                </h4>
                                <div className="flex items-center gap-2 shrink-0">
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <time className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                </time>
                                {notification.actionUrl && (
                                  <Badge variant="outline" className="text-xs">
                                    Click to view
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationCenter;