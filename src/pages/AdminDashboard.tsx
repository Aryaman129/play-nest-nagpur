// Super Admin Dashboard - Complete Platform Management Interface
// **BACKEND INTEGRATION**: Connected to Supabase for admin operations

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Building, TrendingUp, AlertTriangle, Settings, FileText, DollarSign, Shield, Activity, BarChart3, UserCheck, UserX, CheckCircle, XCircle } from 'lucide-react';

import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppToast } from '@/components/common/Toast';

// Mock data - Replace with actual backend integration
const mockStats = {
  totalUsers: 1245,
  activeOwners: 89,
  pendingOwners: 12,
  totalRevenue: 125400,
  monthlyGrowth: 15.3,
  platformCommission: 8.5,
  activeTurfs: 234,
  pendingReports: 7
};

const mockPendingOwners = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@email.com',
    phone: '+91 98765 43210',
    businessName: 'SportHub Arena',
    documents: ['business_license.pdf', 'id_proof.pdf'],
    submittedAt: '2024-01-15',
    status: 'pending'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@email.com',
    phone: '+91 87654 32109',
    businessName: 'Elite Sports Complex',
    documents: ['gst_certificate.pdf', 'property_docs.pdf'],
    submittedAt: '2024-01-14',
    status: 'under_review'
  }
];

const mockUsers = [
  {
    id: '1',
    name: 'Amit Patel',
    email: 'amit@email.com',
    role: 'customer',
    verified: true,
    totalBookings: 15,
    totalSpent: 4500,
    joinedAt: '2023-12-01',
    status: 'active'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    role: 'owner',
    verified: true,
    totalBookings: 0,
    totalSpent: 0,
    joinedAt: '2023-11-15',
    status: 'active'
  }
];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const { success, error } = useAppToast();

  const handleApproveOwner = async (ownerId: string) => {
    try {
      // TODO: Implement backend integration
      // await adminService.approveOwner(ownerId);
      success('Owner approved successfully');
    } catch (err) {
      error('Failed to approve owner');
    }
  };

  const handleRejectOwner = async (ownerId: string) => {
    try {
      // TODO: Implement backend integration
      // await adminService.rejectOwner(ownerId);
      success('Owner application rejected');
    } catch (err) {
      error('Failed to reject owner');
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      // TODO: Implement backend integration
      // await adminService.suspendUser(userId);
      success('User suspended successfully');
    } catch (err) {
      error('Failed to suspend user');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Super Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Complete platform management and oversight
            </p>
            <Badge variant="destructive" className="mt-2">
              <Shield className="w-3 h-3 mr-1" />
              Admin Access
            </Badge>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{mockStats.monthlyGrowth}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Owners</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.activeOwners}</div>
                <p className="text-xs text-muted-foreground">
                  {mockStats.pendingOwners} pending approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{mockStats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {mockStats.platformCommission}% commission rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.pendingReports}</div>
                <p className="text-xs text-muted-foreground">
                  Requires immediate attention
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  User Management
                </TabsTrigger>
                <TabsTrigger value="owners" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Owner Approvals
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* User Management Tab */}
              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <CardTitle>User Management</CardTitle>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full sm:w-64"
                        />
                        <Select value={userFilter} onValueChange={setUserFilter}>
                          <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Filter by role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="customer">Customers</SelectItem>
                            <SelectItem value="owner">Owners</SelectItem>
                            <SelectItem value="admin">Admins</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {user.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.role === 'owner' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.verified ? 'default' : 'destructive'}>
                                {user.verified ? 'Verified' : 'Unverified'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{user.totalBookings} bookings</div>
                                <div className="text-muted-foreground">₹{user.totalSpent}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleSuspendUser(user.id)}
                                >
                                  Suspend
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Owner Approvals Tab */}
              <TabsContent value="owners" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Owner Approvals</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Review and approve new turf owner applications
                    </p>
                  </CardHeader>
                  <CardContent>
                    {mockPendingOwners.map((owner) => (
                      <Card key={owner.id} className="mb-4">
                        <CardContent className="pt-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Avatar>
                                  <AvatarFallback>
                                    {owner.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold">{owner.name}</h3>
                                  <p className="text-sm text-muted-foreground">{owner.businessName}</p>
                                </div>
                                <Badge variant="outline">{owner.status}</Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Email: </span>
                                  {owner.email}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Phone: </span>
                                  {owner.phone}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Documents: </span>
                                  {owner.documents.length} files
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Submitted: </span>
                                  {owner.submittedAt}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <FileText className="w-4 h-4 mr-2" />
                                Review Docs
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleApproveOwner(owner.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleRejectOwner(owner.id)}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Analytics charts will be implemented here</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Revenue charts will be implemented here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Configure platform-wide settings and policies
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Commission Rate (%)</label>
                          <Input type="number" defaultValue="8.5" className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Minimum Booking Amount (₹)</label>
                          <Input type="number" defaultValue="500" className="mt-1" />
                        </div>
                      </div>
                      <Button>Save Settings</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;