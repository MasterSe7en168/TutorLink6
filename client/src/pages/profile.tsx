import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { TutorWithProfile } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, GraduationCap } from "lucide-react";
import BookingModal from "@/components/booking-modal";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { id } = useParams();
  const [bookingOpen, setBookingOpen] = useState(false);

  const { data: tutor, isLoading } = useQuery<TutorWithProfile>({
    queryKey: ["/api/tutors", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-6 mb-6">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Tutor not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 !== 0;
    
    return (
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-current" />
        ))}
        {hasHalfStar && <Star className="h-5 w-5 fill-current opacity-50" />}
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8">
              {/* Header Section */}
              <div className="flex items-start gap-6 mb-8">
                <img 
                  src={tutor.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"} 
                  alt={tutor.fullName} 
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{tutor.fullName}</h1>
                  <p className="text-xl text-gray-600 mb-3">{tutor.tutorProfile.title}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {renderStars(tutor.tutorProfile.rating)}
                      <span className="ml-2 text-gray-600">
                        {tutor.tutorProfile.rating} ({tutor.tutorProfile.reviewCount} reviews)
                      </span>
                    </div>
                    
                    {tutor.tutorProfile.location && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{tutor.tutorProfile.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ${tutor.tutorProfile.hourlyRate}/hour
                    </span>
                    <Button 
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => setBookingOpen(true)}
                    >
                      Book Lesson
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-3">About</h2>
                    <p className="text-gray-700 leading-relaxed">{tutor.tutorProfile.bio}</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-3">Subjects</h2>
                    <div className="flex flex-wrap gap-2">
                      {tutor.tutorProfile.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="px-3 py-1">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Experience & Education</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">Experience</p>
                          <p className="text-gray-600">{tutor.tutorProfile.experience}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">Education</p>
                          <p className="text-gray-600">{tutor.tutorProfile.education}</p>
                        </div>
                      </div>

                      {tutor.tutorProfile.availability && (
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium">Availability</p>
                            <p className="text-gray-600">{tutor.tutorProfile.availability}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <BookingModal 
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        tutor={tutor}
      />
    </>
  );
}
