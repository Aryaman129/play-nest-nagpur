// Enhanced PricingTab Component - Phase 4 Implementation
// **BACKEND INTEGRATION**: All pricing data should be stored in database with real-time updates

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Settings,
  Plus,
  Edit,
  Save,
  X,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAppToast } from '@/components/common/Toast';

// **DATABASE INTEGRATION TYPES**
interface PricingRule {
  id: string;
  name: string;
  timeSlot: string;
  dayType: 'weekday' | 'weekend' | 'holiday';
  basePrice: number;
  multiplier: number;
  finalPrice: number;
  isActive: boolean;
  sport: string;
}

const PricingTab = () => {
  const { success, error } = useAppToast();

  // **BACKEND INTEGRATION STATE**
  // All this data should come from database
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([
    {
      id: '1',
      name: 'Morning Slot',
      timeSlot: '06:00-12:00',
      dayType: 'weekday',
      basePrice: 1000,
      multiplier: 0.8,
      finalPrice: 800,
      isActive: true,
      sport: 'Football'
    },
    {
      id: '2',
      name: 'Evening Prime',
      timeSlot: '18:00-22:00',
      dayType: 'weekend',
      basePrice: 1000,
      multiplier: 1.5,
      finalPrice: 1500,
      isActive: true,
      sport: 'Football'
    }
  ]);

  const [sports] = useState(['Football', 'Cricket', 'Tennis', 'Badminton']);
  const [selectedSport, setSelectedSport] = useState('Football');
  const [showAddForm, setShowAddForm] = useState(false);

  // **DATABASE INTEGRATION FUNCTION**
  // Load pricing rules from database
  useEffect(() => {
    loadPricingRules();
  }, [selectedSport]);

  const loadPricingRules = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await pricingService.getPricingRules(selectedSport);
      console.log(`Loading pricing rules for ${selectedSport}`);
    } catch (err) {
      error('Failed to load pricing rules');
    }
  };

  const filteredRules = pricingRules.filter(rule => rule.sport === selectedSport);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pricing Management</h2>
          <p className="text-muted-foreground">
            Configure dynamic pricing for different time slots and days
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Pricing Rule
        </Button>
      </div>

      {/* Sport Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Sport Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              {sports.map(sport => (
                <SelectItem key={sport} value={sport}>
                  {sport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Pricing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Price</p>
                <p className="text-2xl font-bold">₹{Math.round(filteredRules.reduce((sum, rule) => sum + rule.finalPrice, 0) / filteredRules.length || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold">{filteredRules.filter(r => r.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue Impact</p>
                <p className="text-2xl font-bold text-green-600">+15%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Pricing Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            AI Pricing Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                  💡
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Optimize Off-Peak Hours
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Consider reducing prices by 15-20% for 6 AM - 10 AM slots to increase bookings. 
                    Current occupancy: 40%
                  </p>
                  <Button size="sm" variant="outline" className="mt-3">
                    Apply Suggestion
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                  📈
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    Weekend Premium Pricing
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    High demand detected for weekend evenings. Consider increasing prices by 25% 
                    for Friday-Sunday 6 PM - 10 PM slots.
                  </p>
                  <Button size="sm" variant="outline" className="mt-3">
                    Implement Premium
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Suggestions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Rules List */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Rules for {selectedSport}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRules.map((rule) => (
              <motion.div
                key={rule.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-semibold">{rule.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {rule.timeSlot} • {rule.dayType}
                      </p>
                    </div>
                    <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Base Price:</span>
                    <p className="font-semibold">₹{rule.basePrice}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Multiplier:</span>
                    <p className="font-semibold">{rule.multiplier}x</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Final Price:</span>
                    <p className="font-semibold text-primary">₹{rule.finalPrice}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Impact:</span>
                    <p className={`font-semibold ${rule.multiplier > 1 ? 'text-green-600' : rule.multiplier < 1 ? 'text-red-600' : 'text-gray-600'}`}>
                      {rule.multiplier > 1 ? '+' : ''}{Math.round((rule.multiplier - 1) * 100)}%
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingTab;