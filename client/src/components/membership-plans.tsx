import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Shield, Star } from "lucide-react";
import { MembershipPlan } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MembershipPlansProps {
  tutorId: string;
  currentTier?: string;
}

export default function MembershipPlans({ tutorId, currentTier }: MembershipPlansProps) {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const { data: plans, isLoading } = useQuery<MembershipPlan[]>({
    queryKey: ["/api/membership-plans"],
  });

  const upgradeMutation = useMutation({
    mutationFn: async (planName: string) => {
      const response = await fetch(`/api/tutors/${tutorId}/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to upgrade membership");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Membership Upgraded!",
        description: "Your membership has been successfully upgraded.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tutors"] });
    },
    onError: () => {
      toast({
        title: "Upgrade Failed",
        description: "There was an error upgrading your membership. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'elite':
        return <Crown className="h-6 w-6 text-purple-600" />;
      case 'premium':
        return <Shield className="h-6 w-6 text-blue-600" />;
      default:
        return <Star className="h-6 w-6 text-gray-600" />;
    }
  };

  const getPlanCardClass = (planName: string) => {
    const baseClass = "relative h-full transition-all duration-200 hover:shadow-lg";
    if (planName.toLowerCase() === 'elite') {
      return `${baseClass} border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-white`;
    }
    if (planName.toLowerCase() === 'premium') {
      return `${baseClass} border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white`;
    }
    return `${baseClass} border-gray-200`;
  };

  const isCurrentPlan = (planName: string) => {
    return currentTier?.toLowerCase() === planName.toLowerCase();
  };

  const handleUpgrade = (planName: string) => {
    upgradeMutation.mutate(planName);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="h-96 animate-pulse">
            <CardContent className="p-6">
              <div className="h-full bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
        <p className="text-gray-600">Upgrade your membership to get more visibility and features</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans?.map((plan) => (
          <Card key={plan.id} className={getPlanCardClass(plan.name)}>
            {plan.name.toLowerCase() === 'premium' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                {getPlanIcon(plan.name)}
              </div>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-gray-900">
                ${plan.price}
                <span className="text-lg font-normal text-gray-600">/month</span>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 mb-6 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Priority Boost:</span>
                  <span className="font-semibold">+{plan.priorityBoost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Subjects:</span>
                  <span className="font-semibold">{plan.maxSubjects}</span>
                </div>
              </div>

              {isCurrentPlan(plan.name) ? (
                <Button className="w-full" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={upgradeMutation.isPending}
                  variant={plan.name.toLowerCase() === 'elite' ? 'default' : 'outline'}
                >
                  {upgradeMutation.isPending ? 'Upgrading...' : `Upgrade to ${plan.name}`}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>All plans include a 30-day money-back guarantee</p>
        <p className="mt-1">Cancel anytime • No setup fees • Instant activation</p>
      </div>
    </div>
  );
}