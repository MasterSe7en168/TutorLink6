import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TutorWithProfile } from "@shared/schema";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: TutorWithProfile;
}

export default function BookingModal({ isOpen, onClose, tutor }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(60); // minutes
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Calculate booking cost
  const { data: costCalculation } = useQuery({
    queryKey: ["/api/bookings/calculate", { duration, hourlyRate: parseFloat(tutor.tutorProfile.hourlyRate) }],
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/bookings/calculate", {
        duration,
        hourlyRate: parseFloat(tutor.tutorProfile.hourlyRate)
      });
      return response.json();
    },
    enabled: duration > 0,
  });

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: (booking) => {
      toast({
        title: "Booking created!",
        description: "Your lesson has been scheduled. Proceeding to payment...",
      });
      // In a real app, redirect to payment processing
      processPayment(booking.id);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const processPaymentMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await apiRequest("POST", `/api/bookings/${bookingId}/pay`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment successful!",
        description: "Your lesson is confirmed. You'll receive a confirmation email soon.",
      });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        title: "Payment failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const processPayment = (bookingId: string) => {
    processPaymentMutation.mutate(bookingId);
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTime("");
    setDuration(60);
    setSubject("");
    setNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to book a lesson.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate || !selectedTime || !subject) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Create start and end times
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);

    createBookingMutation.mutate({
      studentId: user.id,
      tutorId: tutor.id,
      subject,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      hourlyRate: tutor.tutorProfile.hourlyRate,
      notes: notes || undefined
    });
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
  ];

  const durationOptions = [
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" },
    { value: 120, label: "2 hours" },
    { value: 180, label: "3 hours" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book a Lesson with {tutor.fullName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tutor Summary */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <img 
              src={tutor.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"} 
              alt={tutor.fullName} 
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{tutor.fullName}</h3>
              <p className="text-sm text-gray-600">{tutor.tutorProfile.title}</p>
              <p className="text-sm font-medium text-primary">${tutor.tutorProfile.hourlyRate}/hour</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subject Selection */}
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {tutor.tutorProfile.subjects.map((subj) => (
                    <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration Selection */}
            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Selection */}
            <div>
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div>
              <Label htmlFor="time">Time *</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Any specific topics or goals for this lesson..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Cost Summary */}
          {costCalculation && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Lesson Summary</h4>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Lesson cost ({duration} min @ ${tutor.tutorProfile.hourlyRate}/hr):</span>
                  <span>${costCalculation.totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform fee (15%):</span>
                  <span>-${costCalculation.platformFee}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tutor earnings:</span>
                  <span>${costCalculation.tutorEarnings}</span>
                </div>
                <div className="flex justify-between font-semibold text-blue-900 pt-2 border-t">
                  <span>Total amount:</span>
                  <span>${costCalculation.totalAmount}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={createBookingMutation.isPending || processPaymentMutation.isPending}
            >
              {createBookingMutation.isPending || processPaymentMutation.isPending 
                ? "Processing..." 
                : `Book Lesson - $${costCalculation?.totalAmount || '0'}`
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}