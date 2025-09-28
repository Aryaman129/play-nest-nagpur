import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Star,
  Wifi,
  Car,
  Coffee,
  Shield,
  Camera,
  Plus,
  Edit,
  Save,
  X,
  Image,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppToast } from '@/components/common/Toast';
import { Turf } from '@/types/turf';
import { SPORTS, AMENITIES } from '@/utils/mockData';

interface TurfManagementProps {
  turf: Turf;
  onUpdate?: (updatedTurf: Turf) => void;
}

const TurfManagement = ({ turf, onUpdate }: TurfManagementProps) => {
  const { success, error } = useAppToast();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Turf>(turf);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Mock API call to update turf
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onUpdate?.(formData);
      setEditMode(false);
      success('Turf information updated successfully');
    } catch (err) {
      error('Failed to update turf information');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(turf);
    setEditMode(false);
  };

  const updateField = <K extends keyof Turf>(field: K, value: Turf[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateLocation = <K extends keyof Turf['location']>(field: K, value: Turf['location'][K]) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }));
  };

  const updateAvailability = <K extends keyof Turf['availability']>(field: K, value: Turf['availability'][K]) => {
    setFormData(prev => ({
      ...prev,
      availability: { ...prev.availability, [field]: value }
    }));
  };

  const toggleSport = (sport: string) => {
    setFormData(prev => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport]
    }));
  };

  const toggleAmenity = (amenityId: string) => {
    const amenity = AMENITIES.find(a => a.id === amenityId);
    if (!amenity) return;

    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.some(a => a.id === amenityId)
        ? prev.amenities.filter(a => a.id !== amenityId)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Mock image upload
      const newPhotos = Array.from(files).map((file, index) => 
        URL.createObjectURL(file)
      );
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
      success(`${files.length} image(s) uploaded successfully`);
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Turf Management</h2>
          <p className="text-muted-foreground">Manage your turf information and settings</p>
        </div>
        <div className="flex gap-3">
          {editMode ? (
            <>
              <Button onClick={handleCancel} variant="outline" disabled={loading}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2"
                  >
                    <Save className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Turf
            </Button>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Turf Name</Label>
              {editMode ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              ) : (
                <div className="p-3 bg-muted/50 rounded-md">{formData.name}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price (per hour)</Label>
              {editMode ? (
                <Input
                  id="basePrice"
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => updateField('basePrice', parseInt(e.target.value))}
                />
              ) : (
                <div className="p-3 bg-muted/50 rounded-md">₹{formData.basePrice}</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            {editMode ? (
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
              />
            ) : (
              <div className="p-3 bg-muted/50 rounded-md">{formData.description}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Location Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              {editMode ? (
                <Input
                  id="address"
                  value={formData.location.address}
                  onChange={(e) => updateLocation('address', e.target.value)}
                />
              ) : (
                <div className="p-3 bg-muted/50 rounded-md">{formData.location.address}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark</Label>
              {editMode ? (
                <Input
                  id="landmark"
                  value={formData.location.landmark}
                  onChange={(e) => updateLocation('landmark', e.target.value)}
                />
              ) : (
                <div className="p-3 bg-muted/50 rounded-md">{formData.location.landmark}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              {editMode ? (
                <Input
                  id="city"
                  value={formData.location.city}
                  onChange={(e) => updateLocation('city', e.target.value)}
                />
              ) : (
                <div className="p-3 bg-muted/50 rounded-md">{formData.location.city}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              {editMode ? (
                <Input
                  id="pincode"
                  value={formData.location.pincode}
                  onChange={(e) => updateLocation('pincode', e.target.value)}
                />
              ) : (
                <div className="p-3 bg-muted/50 rounded-md">{formData.location.pincode}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sports & Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Sports & Amenities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Available Sports</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              {SPORTS.map((sport) => (
                <div key={sport} className="flex items-center space-x-2">
                  {editMode ? (
                    <>
                      <Checkbox
                        id={sport}
                        checked={formData.sports.includes(sport)}
                        onCheckedChange={() => toggleSport(sport)}
                      />
                      <Label htmlFor={sport} className="text-sm">{sport}</Label>
                    </>
                  ) : (
                    <Badge
                      variant={formData.sports.includes(sport) ? "default" : "outline"}
                      className="w-full justify-center"
                    >
                      {sport}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-base font-medium">Amenities</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {AMENITIES.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-3">
                  {editMode ? (
                    <>
                      <Checkbox
                        id={amenity.id}
                        checked={formData.amenities.some(a => a.id === amenity.id)}
                        onCheckedChange={() => toggleAmenity(amenity.id)}
                      />
                      <Label htmlFor={amenity.id} className="flex items-center gap-2 text-sm">
                        <span>{amenity.icon}</span>
                        {amenity.name}
                      </Label>
                    </>
                  ) : (
                    <Badge
                      variant={formData.amenities.some(a => a.id === amenity.id) ? "default" : "outline"}
                      className="w-full justify-start"
                    >
                      <span className="mr-2">{amenity.icon}</span>
                      {amenity.name}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Operating Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="openTime">Opening Time</Label>
              {editMode ? (
                <Input
                  id="openTime"
                  type="time"
                  value={formData.availability.openTime}
                  onChange={(e) => updateAvailability('openTime', e.target.value)}
                />
              ) : (
                <div className="p-3 bg-muted/50 rounded-md">{formData.availability.openTime}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="closeTime">Closing Time</Label>
              {editMode ? (
                <Input
                  id="closeTime"
                  type="time"
                  value={formData.availability.closeTime}
                  onChange={(e) => updateAvailability('closeTime', e.target.value)}
                />
              ) : (
                <div className="p-3 bg-muted/50 rounded-md">{formData.availability.closeTime}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Turf Photos
          </CardTitle>
          <CardDescription>
            Add photos to showcase your turf (max 10 photos)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {editMode && (
            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="photo-upload"
              />
              <Label htmlFor="photo-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photos
                  </span>
                </Button>
              </Label>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={photo}
                    alt={`Turf photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {editMode && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </motion.div>
            ))}
            
            {formData.photos.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No photos uploaded yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TurfManagement;