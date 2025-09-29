// Dispute Management Table - Admin Issue Resolution System
// **BACKEND INTEGRATION**: Connects to dispute management and resolution API

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MessageSquare, 
  Clock,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAppToast } from '@/components/common/Toast';
import { format } from 'date-fns';

// **DATABASE INTEGRATION TYPES**
interface Dispute {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  turfId: string;
  turfName: string;
  category: 'facility' | 'booking' | 'payment' | 'service' | 'safety' | 'other';
  priority: 'low' | 'medium' | 'high';
  subject: string;
  description: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  assignedTo?: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  photos?: string[];
}

// Mock disputes data - REPLACE WITH BACKEND API
const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'disp_001',
    bookingId: 'book_001',
    customerId: '1',
    customerName: 'John Doe',
    customerEmail: 'john.doe@email.com',
    turfId: '1',
    turfName: 'Green Valley Sports Complex',
    category: 'facility',
    priority: 'high',
    subject: 'Poor turf condition - muddy and unplayable',
    description: 'The turf was extremely muddy and unsafe to play on. Several players slipped and it was impossible to have a proper game. The drainage system seems to be faulty.',
    status: 'pending',
    createdAt: new Date('2024-01-20T10:30:00'),
    updatedAt: new Date('2024-01-20T10:30:00'),
    photos: ['/assets/turf-muddy.jpg'],
  },
  {
    id: 'disp_002',
    bookingId: 'book_002',
    customerId: '2',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@email.com',
    turfId: '2',
    turfName: 'Champions Arena',
    category: 'service',
    priority: 'medium',
    subject: 'Rude staff behavior and poor service',
    description: 'The staff was very uncooperative and rude when we asked for basic facilities. They were not helpful at all and made the experience unpleasant.',
    status: 'under_review',
    assignedTo: 'admin@playnest.com',
    createdAt: new Date('2024-01-18T14:15:00'),
    updatedAt: new Date('2024-01-19T09:00:00'),
  },
  {
    id: 'disp_003',
    bookingId: 'book_003',
    customerId: '3',
    customerName: 'Mike Chen',
    customerEmail: 'mike.chen@email.com',
    turfId: '1',
    turfName: 'Green Valley Sports Complex',
    category: 'payment',
    priority: 'low',
    subject: 'Refund not processed for cancelled booking',
    description: 'I cancelled my booking 3 hours in advance as per policy, but the refund has not been processed even after 5 business days.',
    status: 'resolved',
    resolution: 'Refund processed successfully. Processing delay was due to payment gateway issues which have been resolved.',
    createdAt: new Date('2024-01-15T16:45:00'),
    updatedAt: new Date('2024-01-17T11:20:00'),
  },
];

const CATEGORY_LABELS = {
  facility: { label: 'Facility Issues', color: 'bg-red-100 text-red-800' },
  booking: { label: 'Booking Problems', color: 'bg-blue-100 text-blue-800' },
  payment: { label: 'Payment Issues', color: 'bg-green-100 text-green-800' },
  service: { label: 'Service Quality', color: 'bg-purple-100 text-purple-800' },
  safety: { label: 'Safety Concerns', color: 'bg-orange-100 text-orange-800' },
  other: { label: 'Other Issues', color: 'bg-gray-100 text-gray-800' },
};

const PRIORITY_LABELS = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  high: { label: 'High', color: 'bg-red-100 text-red-800' },
};

const STATUS_LABELS = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-800' },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-800' },
  dismissed: { label: 'Dismissed', color: 'bg-gray-100 text-gray-800' },
};

const DisputeTable: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES);
  const [filteredDisputes, setFilteredDisputes] = useState<Dispute[]>(MOCK_DISPUTES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolution, setResolution] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useAppToast();

  // **BACKEND INTEGRATION**: Load disputes from API
  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await disputeService.getDisputes();
      // setDisputes(response.data);
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      error('Failed to load disputes');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter disputes based on search and filters
  useEffect(() => {
    let filtered = disputes;

    // Search filter
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(dispute =>
        dispute.subject.toLowerCase().includes(lowercaseSearch) ||
        dispute.customerName.toLowerCase().includes(lowercaseSearch) ||
        dispute.turfName.toLowerCase().includes(lowercaseSearch) ||
        dispute.bookingId.toLowerCase().includes(lowercaseSearch)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(dispute => dispute.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(dispute => dispute.category === categoryFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(dispute => dispute.priority === priorityFilter);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    setFilteredDisputes(filtered);
  }, [disputes, searchTerm, statusFilter, categoryFilter, priorityFilter]);

  // Update dispute status
  const handleStatusUpdate = async (disputeId: string, newStatus: Dispute['status']) => {
    try {
      // **BACKEND INTEGRATION**: Update dispute status
      // await disputeService.updateDispute(disputeId, { status: newStatus, resolution });
      
      setDisputes(prev => prev.map(dispute =>
        dispute.id === disputeId
          ? {
              ...dispute,
              status: newStatus,
              resolution: newStatus === 'resolved' ? resolution : undefined,
              updatedAt: new Date(),
            }
          : dispute
      ));

      success(`Dispute ${newStatus} successfully`);
      setSelectedDispute(null);
      setResolution('');
    } catch (err) {
      error('Failed to update dispute status');
    }
  };

  // Export disputes data
  const handleExportData = () => {
    // **BACKEND INTEGRATION**: Generate and download dispute report
    const csvData = filteredDisputes.map(dispute => ({
      ID: dispute.id,
      'Booking ID': dispute.bookingId,
      Customer: dispute.customerName,
      Turf: dispute.turfName,
      Category: CATEGORY_LABELS[dispute.category].label,
      Priority: PRIORITY_LABELS[dispute.priority].label,
      Status: STATUS_LABELS[dispute.status].label,
      Subject: dispute.subject,
      'Created At': format(dispute.createdAt, 'yyyy-MM-dd HH:mm'),
    }));
    
    success('Dispute data exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dispute Management</h2>
          <p className="text-muted-foreground">
            Review and resolve customer issues and complaints
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={loadDisputes} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {Object.entries(STATUS_LABELS).map(([status, config]) => {
          const count = disputes.filter(d => d.status === status).length;
          return (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{config.label}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <Badge className={config.color}>{count}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search disputes by subject, customer, or booking ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    aria-label="Search disputes"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {Object.entries(STATUS_LABELS).map(([status, config]) => (
                      <SelectItem key={status} value={status}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(CATEGORY_LABELS).map(([category, config]) => (
                      <SelectItem key={category} value={category}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    {Object.entries(PRIORITY_LABELS).map(([priority, config]) => (
                      <SelectItem key={priority} value={priority}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Disputes Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Disputes ({filteredDisputes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Issue Details</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Turf</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDisputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium truncate">{dispute.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            Booking: {dispute.bookingId}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div>
                          <p className="font-medium">{dispute.customerName}</p>
                          <p className="text-xs text-muted-foreground">{dispute.customerEmail}</p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <p className="font-medium truncate max-w-32">{dispute.turfName}</p>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={CATEGORY_LABELS[dispute.category].color}>
                          {CATEGORY_LABELS[dispute.category].label}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={PRIORITY_LABELS[dispute.priority].color}>
                          {PRIORITY_LABELS[dispute.priority].label}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={STATUS_LABELS[dispute.status].color}>
                          {STATUS_LABELS[dispute.status].label}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <p>{format(dispute.createdAt, 'MMM d')}</p>
                          <p className="text-muted-foreground">
                            {format(dispute.createdAt, 'HH:mm')}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedDispute(dispute)}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Dispute Details</DialogTitle>
                              </DialogHeader>
                              
                              {selectedDispute && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="font-medium">Dispute ID:</p>
                                      <p className="text-muted-foreground">{selectedDispute.id}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Booking ID:</p>
                                      <p className="text-muted-foreground">{selectedDispute.bookingId}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Customer:</p>
                                      <p className="text-muted-foreground">{selectedDispute.customerName}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Turf:</p>
                                      <p className="text-muted-foreground">{selectedDispute.turfName}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <p className="font-medium mb-2">Subject:</p>
                                    <p className="text-muted-foreground">{selectedDispute.subject}</p>
                                  </div>

                                  <div>
                                    <p className="font-medium mb-2">Description:</p>
                                    <p className="text-muted-foreground whitespace-pre-wrap">
                                      {selectedDispute.description}
                                    </p>
                                  </div>

                                  {selectedDispute.status === 'pending' && (
                                    <div className="space-y-3">
                                      <div>
                                        <Label htmlFor="resolution">Resolution Notes:</Label>
                                        <Textarea
                                          id="resolution"
                                          placeholder="Enter resolution details..."
                                          value={resolution}
                                          onChange={(e) => setResolution(e.target.value)}
                                          rows={3}
                                        />
                                      </div>
                                      
                                      <div className="flex gap-3">
                                        <Button
                                          onClick={() => handleStatusUpdate(selectedDispute.id, 'resolved')}
                                          className="flex-1"
                                        >
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Resolve
                                        </Button>
                                        <Button
                                          variant="outline"
                                          onClick={() => handleStatusUpdate(selectedDispute.id, 'under_review')}
                                          className="flex-1"
                                        >
                                          <Clock className="w-4 h-4 mr-2" />
                                          Under Review
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          onClick={() => handleStatusUpdate(selectedDispute.id, 'dismissed')}
                                          className="flex-1"
                                        >
                                          <XCircle className="w-4 h-4 mr-2" />
                                          Dismiss
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                  {selectedDispute.resolution && (
                                    <div>
                                      <p className="font-medium mb-2">Resolution:</p>
                                      <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                        {selectedDispute.resolution}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredDisputes.length === 0 && (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No disputes found matching your criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DisputeTable;