import { useAuth } from "@/App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, DollarSign, User, BookOpen, Crown, Shield, Settings } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: string;
  totalAmount: string;
  platformFee: string;
  tutorEarnings: string;
  notes?: string;
  student?: { fullName: string; email: string };
  tutor?: { fullName: string; tutorProfile: { title: string } };
}

interface TutorEarnings {
  earnings: Array<{
    id: string;
    amount: string;
    bookingId: string;
    availableForWithdrawal: boolean;
    createdAt: string;
  }>;
  summary: {
    totalEarnings: string;
    availableEarnings: string;
    pendingEarnings: string;
  };
}

export default function Dashboard() {
  const { user } = useAuth();

  const { data: bookings, isLoading: loadingBookings } = useQuery<Booking[]>({
    queryKey: ["/api/users", user?.id, "bookings"],
    enabled: !!user?.id,
  });

  const { data: earnings, isLoading: loadingEarnings } = useQuery<TutorEarnings>({
    queryKey: ["/api/tutors", user?.id, "earnings"],
    enabled: !!user?.id && user?.userType === "tutor",
  });

  const { data: tutorProfile } = useQuery({
    queryKey: ["/api/tutors", user?.id, "profile"],
    queryFn: async () => {
      const response = await fetch(`/api/tutors/${user?.id}`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      return data.tutorProfile;
    },
    enabled: !!user?.id && user?.userType === "tutor",
  });

  if (loadingBookings) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingBookings = bookings?.filter(booking => 
    new Date(booking.startTime) > new Date() && booking.status === 'confirmed'
  ) || [];

  const pastBookings = bookings?.filter(booking => 
    new Date(booking.startTime) <= new Date() || booking.status === 'completed'
  ) || [];

  const totalSpent = bookings?.reduce((sum, booking) => sum + parseFloat(booking.totalAmount), 0) || 0;
  const totalEarned = parseFloat(earnings?.summary.totalEarnings || '0');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            {user?.userType === 'tutor' ? 'Manage your lessons and earnings' : 'View your bookings and learning progress'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{bookings?.length || 0}</p>
                  <p className="text-gray-600">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                  <p className="text-gray-600">Upcoming Lessons</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ${user?.userType === 'tutor' ? totalEarned.toFixed(2) : totalSpent.toFixed(2)}
                  </p>
                  <p className="text-gray-600">
                    {user?.userType === 'tutor' ? 'Total Earned' : 'Total Spent'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tutor Earnings Dashboard */}
        {user?.userType === 'tutor' && earnings && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Earnings Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Available for Withdrawal</p>
                      <p className="text-2xl font-bold text-green-700">${earnings.summary.availableEarnings}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-600 font-medium">Pending</p>
                      <p className="text-2xl font-bold text-yellow-700">${earnings.summary.pendingEarnings}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Total Earned</p>
                      <p className="text-2xl font-bold text-blue-700">${earnings.summary.totalEarnings}</p>
                    </div>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    Request Withdrawal
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Membership Status Card */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-purple-600" />
                  Membership Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="flex justify-center mb-2">
                    {tutorProfile?.membershipTier === 'elite' ? (
                      <Crown className="h-8 w-8 text-purple-600" />
                    ) : tutorProfile?.membershipTier === 'premium' ? (
                      <Shield className="h-8 w-8 text-blue-600" />
                    ) : (
                      <Settings className="h-8 w-8 text-gray-600" />
                    )}
                  </div>
                  <p className="text-lg font-semibold">
                    {tutorProfile?.membershipTier ? 
                      tutorProfile.membershipTier.charAt(0).toUpperCase() + tutorProfile.membershipTier.slice(1) : 
                      'Basic'
                    } Plan
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Priority Ranking: {tutorProfile?.priorityRanking || 0}
                  </p>
                </div>
                <Link href="/membership">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    Upgrade Membership
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bookings Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>
              {user?.userType === 'tutor' ? 'Your Teaching Schedule' : 'Your Learning Schedule'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
                <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-4">
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming lessons scheduled</p>
                    <p className="text-sm">
                      {user?.userType === 'student' ? 'Browse tutors to book your first lesson!' : 'Students will book lessons with you soon!'}
                    </p>
                  </div>
                ) : (
                  upcomingBookings.map((booking) => (
                    <Card key={booking.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-2">{booking.subject}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(booking.startTime), 'MMM dd, yyyy')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {user?.userType === 'student' 
                                  ? booking.tutor?.fullName 
                                  : booking.student?.fullName
                                }
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                            <p className="text-lg font-semibold mt-2">${booking.totalAmount}</p>
                          </div>
                        </div>
                        {booking.notes && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm"><strong>Notes:</strong> {booking.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="past" className="space-y-4">
                {pastBookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No past lessons yet</p>
                  </div>
                ) : (
                  pastBookings.map((booking) => (
                    <Card key={booking.id} className="opacity-75">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-2">{booking.subject}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(booking.startTime), 'MMM dd, yyyy')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {user?.userType === 'student' 
                                  ? booking.tutor?.fullName 
                                  : booking.student?.fullName
                                }
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                            <p className="text-lg font-semibold mt-2">${booking.totalAmount}</p>
                          </div>
                        </div>
                        {booking.notes && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm"><strong>Notes:</strong> {booking.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}