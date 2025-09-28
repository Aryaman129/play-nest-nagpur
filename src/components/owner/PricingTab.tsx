import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Clock, Calendar, TrendingUp, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppToast } from '@/components/common/Toast';

interface PricingRule {
  id: string;
  name: string;
  timeStart: string;
  timeEnd: string;
  price: number;
  days: string[];
  isActive: boolean;
}

interface DynamicRule {
  id: string;
  name: string;
  multiplier: number;
  isActive: boolean;
  description: string;
}

const PricingTab = () => {
  const { success, error } = useAppToast();
  
  const [basePrice, setBasePrice] = useState(1200);
  const [isDynamicPricingEnabled, setIsDynamicPricingEnabled] = useState(true);
  
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([
    {
      id: '1',
      name: 'Morning Discount',
      timeStart: '06:00',
      timeEnd: '10:00',
      price: 800,
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      isActive: true
    },
    {
      id: '2',
      name: 'Peak Evening',
      timeStart: '18:00',
      timeEnd: '22:00',
      price: 1800,
      days: ['friday', 'saturday', 'sunday'],
      isActive: true
    },
    {
      id: '3',
      name: 'Weekend Special',
      timeStart: '10:00',
      timeEnd: '18:00',
      price: 1500,
      days: ['saturday', 'sunday'],
      isActive: true
    }
  ]);
  
  const [dynamicRules, setDynamicRules] = useState<DynamicRule[]>([
    {
      id: '1',
      name: 'High Demand (80%+ bookings)',
      multiplier: 1.2,
      isActive: true,
      description: 'Increase price by 20% when demand is high'
    },
    {
      id: '2',
      name: 'Holiday Surcharge',
      multiplier: 1.5,
      isActive: true,
      description: 'Increase price by 50% on public holidays'
    },
    {
      id: '3',
      name: 'Last Minute Booking',
      multiplier: 1.1,
      isActive: false,
      description: 'Increase price by 10% for bookings made within 2 hours'
    }
  ]);

  const handleSaveBasicPricing = () => {
    // Mock API call
    setTimeout(() => {
      success('Basic pricing updated successfully');
    }, 500);
  };

  const handleSaveTimeBasedPricing = () => {
    // Mock API call
    setTimeout(() => {
      success('Time-based pricing rules updated');
    }, 500);
  };

  const handleSaveDynamicPricing = () => {
    // Mock API call
    setTimeout(() => {
      success('Dynamic pricing rules updated');
    }, 500);
  };

  const addNewRule = () => {
    const newRule: PricingRule = {
      id: Date.now().toString(),
      name: 'New Rule',
      timeStart: '12:00',
      timeEnd: '14:00',
      price: basePrice,
      days: ['monday'],
      isActive: true
    };
    setPricingRules([...pricingRules, newRule]);
  };

  const updateRule = (id: string, updates: Partial<PricingRule>) => {
    setPricingRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
  };

  const deleteRule = (id: string) => {
    setPricingRules(prev => prev.filter(rule => rule.id !== id));
  };

  const toggleDynamicRule = (id: string) => {
    setDynamicRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const dayNames = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Pricing</TabsTrigger>
          <TabsTrigger value="time-based">Time-Based Rules</TabsTrigger>
          <TabsTrigger value="dynamic">Dynamic Pricing</TabsTrigger>
        </TabsList>

        {/* Basic Pricing */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Base Pricing
              </CardTitle>
              <CardDescription>
                Set your standard hourly rate for turf bookings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="basePrice" className="text-lg font-medium">
                      Base Price per Hour
                    </Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        ₹
                      </span>
                      <Input
                        id="basePrice"
                        type="number"
                        value={basePrice}
                        onChange={(e) => setBasePrice(Number(e.target.value))}
                        className="pl-8 text-lg font-semibold"
                        min="0"
                        step="50"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      This is your default rate when no other rules apply
                    </p>
                  </div>
                  
                  <Button onClick={handleSaveBasicPricing} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Base Price
                  </Button>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Pricing Preview</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>1 Hour:</span>
                      <span className="font-semibold">₹{basePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2 Hours:</span>
                      <span className="font-semibold">₹{basePrice * 2}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Half Day (4 hrs):</span>
                      <span className="font-semibold">₹{basePrice * 4}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Full Day (8 hrs):</span>
                      <span className="font-semibold">₹{basePrice * 8}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time-Based Pricing */}
        <TabsContent value="time-based">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Time-Based Pricing Rules
              </CardTitle>
              <CardDescription>
                Set different prices for specific time slots and days
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Active Rules</h3>
                <Button onClick={addNewRule} variant="outline">
                  + Add New Rule
                </Button>
              </div>
              
              <div className="space-y-4">
                {pricingRules.map((rule, index) => (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card-turf"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Input
                          value={rule.name}
                          onChange={(e) => updateRule(rule.id, { name: e.target.value })}
                          className="font-semibold text-lg flex-1 mr-4"
                        />
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={rule.isActive}
                            onCheckedChange={(checked) => updateRule(rule.id, { isActive: checked })}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteRule(rule.id)}
                            className="text-destructive"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Time Range</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="time"
                              value={rule.timeStart}
                              onChange={(e) => updateRule(rule.id, { timeStart: e.target.value })}
                            />
                            <span>to</span>
                            <Input
                              type="time"
                              value={rule.timeEnd}
                              onChange={(e) => updateRule(rule.id, { timeEnd: e.target.value })}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Price per Hour</Label>
                          <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                              ₹
                            </span>
                            <Input
                              type="number"
                              value={rule.price}
                              onChange={(e) => updateRule(rule.id, { price: Number(e.target.value) })}
                              className="pl-8"
                              min="0"
                              step="50"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Active Days</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {dayNames.map((day) => (
                              <button
                                key={day.key}
                                onClick={() => {
                                  const isSelected = rule.days.includes(day.key);
                                  const newDays = isSelected
                                    ? rule.days.filter(d => d !== day.key)
                                    : [...rule.days, day.key];
                                  updateRule(rule.id, { days: newDays });
                                }}
                                className={`px-2 py-1 text-xs rounded transition-colors ${
                                  rule.days.includes(day.key)
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                              >
                                {day.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Button onClick={handleSaveTimeBasedPricing} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Time-Based Rules
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dynamic Pricing */}
        <TabsContent value="dynamic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Dynamic Pricing
              </CardTitle>
              <CardDescription>
                Automatically adjust prices based on demand and other factors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Enable Dynamic Pricing</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically adjust prices based on the rules below
                  </p>
                </div>
                <Switch
                  checked={isDynamicPricingEnabled}
                  onCheckedChange={setIsDynamicPricingEnabled}
                />
              </div>
              
              {isDynamicPricingEnabled && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dynamic Rules</h3>
                  
                  {dynamicRules.map((rule, index) => (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="card-turf"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{rule.name}</h4>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                          <div className="mt-2">
                            <span className="text-sm font-medium">
                              Price Multiplier: {rule.multiplier}x 
                              <span className="text-primary ml-2">
                                ({rule.multiplier > 1 ? '+' : ''}{((rule.multiplier - 1) * 100).toFixed(0)}%)
                              </span>
                            </span>
                          </div>
                        </div>
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => toggleDynamicRule(rule.id)}
                        />
                      </div>
                    </motion.div>
                  ))}
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">How Dynamic Pricing Works</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Rules are applied in order of priority</li>
                      <li>• Multiple rules can be active simultaneously</li>
                      <li>• Final price = Base Price × Active Multipliers</li>
                      <li>• Customers see the final price before booking</li>
                    </ul>
                  </div>
                </div>
              )}
              
              <Button onClick={handleSaveDynamicPricing} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Dynamic Pricing Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PricingTab;