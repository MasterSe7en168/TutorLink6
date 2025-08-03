import { useAuth } from "@/App";
import { useQuery } from "@tanstack/react-query";
import { TutorProfile } from "@shared/schema";
import MembershipPlans from "@/components/membership-plans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Shield, Star, TrendingUp, Users, Eye } from "lucide-react";

export default function MembershipPage() {
  const { user } = useAuth();

  const { data: tutorProfile } = useQuery<TutorProfile>({
    queryKey: ["/api/tutors", user?.id, "profile"],
    queryFn: async () => {
      const response = await fetch(`/api/tutors/${user?.id}`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      return data.tutorProfile;
    },
    enabled: !!user?.id && user?.userType === "tutor",
  });

  if (!user || user.userType !== "tutor") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">This page is only available for tutors.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getCurrentTierInfo = () => {
    const tier = tutorProfile?.membershipTier?.toLowerCase();
    switch (tier) {
      case 'elite':
        return {
          name: 'Elite',
          icon: <Crown className="h-6 w-6 text-purple-600" />,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          borderColor: 'border-purple-300'
        };
      case 'premium':
        return {
          name: 'Premium',
          icon: <Shield className="h-6 w-6 text-blue-600" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-300'
        };
      default:
        return {
          name: 'Basic',
          icon: <Star className="h-6 w-6 text-gray-600" />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-300'
        };
    }
  };

  const tierInfo = getCurrentTierInfo();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Current Status Card */}
        <Card className={`mb-8 border-2 ${tierInfo.borderColor} ${tierInfo.bgColor.replace('100', '50')}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${tierInfo.bgColor}`}>
                  {tierInfo.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Current Plan: {tierInfo.name}
                  </h2>
                  <p className="text-gray-600">
                    {tutorProfile?.membershipExpiry 
                      ? `Active until ${new Date(tutorProfile.membershipExpiry).toLocaleDateString()}`
                      : 'Free plan - upgrade anytime'
                    }
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <Badge className={`${tierInfo.color} ${tierInfo.bgColor} border-current`}>
                  {tierInfo.name} Member
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Profile Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tutorProfile?.profileViews || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Priority Ranking</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tutorProfile?.priorityRanking || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tutorProfile?.responseRate || 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why Upgrade Your Membership?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Higher Visibility</h3>
                <p className="text-sm text-gray-600">Appear first in search results and get more student inquiries</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Verified Badge</h3>
                <p className="text-sm text-gray-600">Build trust with students through verification</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Crown className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Premium Features</h3>
                <p className="text-sm text-gray-600">Access advanced analytics and customization options</p>
              </div>
              
              <div className="text-center">
                <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="font-semibold mb-2">More Students</h3>
                <p className="text-sm text-gray-600">Attract more students and increase your earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership Plans */}
        <MembershipPlans 
          tutorId={user.id} 
          currentTier={tutorProfile?.membershipTier} 
        />
      </div>
    </div>
  );
}