// Report Issue Form - Customer Issue Reporting System
// **BACKEND INTEGRATION**: Connects to dispute management API

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Send, FileText, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppToast } from '@/components/common/Toast';
import { format } from 'date-fns';

interface ReportIssueFormProps {
  bookingId: string;
  turfName: string;
  bookingDate: Date;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

// Issue categories for better classification
const ISSUE_CATEGORIES = [
  { value: 'facility', label: 'Facility Issues', description: 'Turf condition, equipment, cleanliness' },
  { value: 'booking', label: 'Booking Problems', description: 'Time slots, availability, scheduling' },
  { value: 'payment', label: 'Payment Issues', description: 'Refunds, billing, charges' },
  { value: 'service', label: 'Service Quality', description: 'Staff behavior, responsiveness' },
  { value: 'safety', label: 'Safety Concerns', description: 'Injuries, hazards, security' },
  { value: 'other', label: 'Other Issues', description: 'Any other concerns' },
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
];

const ReportIssueForm: React.FC<ReportIssueFormProps> = ({
  bookingId,
  turfName,
  bookingDate,
  onSubmitSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    category: '',
    priority: 'medium',
    subject: '',
    description: '',
    contactMethod: 'email',
    photos: [] as File[],
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const { success, error } = useAppToast();

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // **BACKEND INTEGRATION**: Implement file size and type validation
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        error(`${file.name} is not a valid image file`);
        return false;
      }
      
      if (!isValidSize) {
        error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      
      return true;
    });

    if (formData.photos.length + validFiles.length > 3) {
      error('Maximum 3 photos allowed');
      return;
    }

    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...validFiles]
    }));
    
    setPhotoPreview(prev => [...prev, ...newPreviews]);
  };

  // Remove photo
  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreview[index]);
    
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    
    setPhotoPreview(prev => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category) {
      error('Please select an issue category');
      return;
    }
    
    if (!formData.subject.trim()) {
      error('Please provide a subject');
      return;
    }
    
    if (!formData.description.trim()) {
      error('Please describe the issue');
      return;
    }

    setIsSubmitting(true);

    try {
      // **BACKEND INTEGRATION**: Submit issue report
      // const formDataToSend = new FormData();
      // formDataToSend.append('bookingId', bookingId);
      // formDataToSend.append('category', formData.category);
      // formDataToSend.append('priority', formData.priority);
      // formDataToSend.append('subject', formData.subject);
      // formDataToSend.append('description', formData.description);
      // formDataToSend.append('contactMethod', formData.contactMethod);
      // 
      // formData.photos.forEach((photo, index) => {
      //   formDataToSend.append(`photo_${index}`, photo);
      // });
      // 
      // await disputeService.reportIssue(formDataToSend);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      success('Issue reported successfully! We will contact you within 24 hours.');
      onSubmitSuccess?.();
      
      // Reset form
      setFormData({
        category: '',
        priority: 'medium',
        subject: '',
        description: '',
        contactMethod: 'email',
        photos: [],
      });
      setPhotoPreview([]);
      
    } catch (err) {
      error('Failed to submit issue report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up preview URLs on unmount
  React.useEffect(() => {
    return () => {
      photoPreview.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Report an Issue
            </CardTitle>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><strong>Booking ID:</strong> {bookingId}</p>
              <p><strong>Turf:</strong> {turfName}</p>
              <p><strong>Date:</strong> {format(bookingDate, 'EEEE, MMMM d, yyyy')}</p>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Issue Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Issue Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger id="category" aria-label="Select issue category">
                    <SelectValue placeholder="Select the type of issue" />
                  </SelectTrigger>
                  <SelectContent>
                    {ISSUE_CATEGORIES.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        <div>
                          <div className="font-medium">{category.label}</div>
                          <div className="text-xs text-muted-foreground">{category.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Level */}
              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => handleInputChange('priority', value)}
                >
                  <SelectTrigger id="priority" aria-label="Select priority level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_LEVELS.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={level.color}>{level.label}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of the issue"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  maxLength={100}
                  aria-label="Issue subject"
                />
                <div className="text-xs text-muted-foreground">
                  {formData.subject.length}/100 characters
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed information about the issue, including what happened, when it occurred, and any steps you've already taken..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={5}
                  maxLength={1000}
                  aria-label="Detailed issue description"
                />
                <div className="text-xs text-muted-foreground">
                  {formData.description.length}/1000 characters
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-3">
                <Label>Attach Photos (Optional)</Label>
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <Camera className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload photos to help us understand the issue better
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                      disabled={formData.photos.length >= 3}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('photo-upload')?.click()}
                      disabled={formData.photos.length >= 3}
                      aria-label="Upload photos"
                    >
                      Choose Photos
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Maximum 3 photos, 5MB each. JPG, PNG formats supported.
                    </p>
                  </div>

                  {/* Photo Previews */}
                  {photoPreview.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {photoPreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index)}
                            aria-label={`Remove photo ${index + 1}`}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Method */}
              <div className="space-y-2">
                <Label htmlFor="contact-method">Preferred Contact Method</Label>
                <Select 
                  value={formData.contactMethod} 
                  onValueChange={(value) => handleInputChange('contactMethod', value)}
                >
                  <SelectTrigger id="contact-method" aria-label="Select contact method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {onCancel && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancel}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1"
                  aria-label="Submit issue report"
                >
                  {isSubmitting ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Report
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Help Information */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                What happens next?
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Your report will be forwarded to the turf management team</li>
                <li>• You'll receive a confirmation email with your report ID</li>
                <li>• We aim to respond within 24 hours for most issues</li>
                <li>• High priority safety issues are addressed immediately</li>
                <li>• You can track the status of your report in your profile</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReportIssueForm;