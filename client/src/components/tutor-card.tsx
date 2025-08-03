import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Crown, Shield, CheckCircle } from "lucide-react";
import { TutorWithProfile } from "@shared/schema";
import BookingModal from "./booking-modal";
import { useState } from "react";

interface TutorCardProps {
  tutor: TutorWithProfile;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const [bookingOpen, setBookingOpen] = useState(false);
  
  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 !== 0;
    
    return (
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
        {hasHalfStar && <Star className="h-4 w-4 fill-current opacity-50" />}
      </div>
    );
  };

  const getMembershipBadge = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'elite':
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-300">
            <Crown className="h-3 w-3 mr-1" />
            Elite
          </Badge>
        );
      case 'premium':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            <Shield className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCardClassName = () => {
    const baseClass = "hover:shadow-lg transition duration-200 overflow-hidden";
    if (tutor.tutorProfile.membershipTier === 'elite') {
      return `${baseClass} border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white`;
    }
    if (tutor.tutorProfile.membershipTier === 'premium') {
      return `${baseClass} border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white`;
    }
    return baseClass;
  };

  return (
    <>
      <Card className={getCardClassName()}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <img 
              src={tutor.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"} 
              alt={tutor.fullName} 
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-lg font-semibold text-gray-900">{tutor.fullName}</h4>
                {tutor.tutorProfile.verifiedBadge && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {tutor.tutorProfile.membershipTier && getMembershipBadge(tutor.tutorProfile.membershipTier)}
              </div>
              <p className="text-sm text-gray-600">{tutor.tutorProfile.title}</p>
              <div className="flex items-center mt-1">
                {renderStars(tutor.tutorProfile.rating)}
                <span className="ml-2 text-sm text-gray-600">
                  {tutor.tutorProfile.rating} ({tutor.tutorProfile.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {tutor.tutorProfile.subjects.slice(0, 3).map((subject, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {subject}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {tutor.tutorProfile.experience} • {tutor.tutorProfile.education}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-primary">
                ${tutor.tutorProfile.hourlyRate}/hr
              </span>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => setBookingOpen(true)}
              >
                Book Lesson
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <BookingModal 
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        tutor={tutor}
      />
    </>
  );
}
