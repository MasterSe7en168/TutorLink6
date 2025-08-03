import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { X } from "lucide-react";

export default function TutorSignup() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    title: "",
    bio: "",
    subjects: [] as string[],
    experience: "",
    education: "",
    hourlyRate: "",
    location: "",
    availability: ""
  });
  
  const [newSubject, setNewSubject] = useState("");

  const createProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/tutors/profile", {
        ...data,
        userId: user?.id
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile created!",
        description: "Your tutor profile has been created successfully.",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const addSubject = () => {
    if (newSubject.trim() && !profileData.subjects.includes(newSubject.trim())) {
      setProfileData(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()]
      }));
      setNewSubject("");
    }
  };

  const removeSubject = (subject: string) => {
    setProfileData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to create a tutor profile.",
        variant: "destructive",
      });
      return;
    }

    if (profileData.subjects.length === 0) {
      toast({
        title: "Add subjects",
        description: "Please add at least one subject you can teach.",
        variant: "destructive",
      });
      return;
    }

    createProfileMutation.mutate(profileData);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Please log in to create a tutor profile.</p>
            <Button 
              className="w-full mt-4" 
              onClick={() => setLocation("/")}
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Tutor Profile</CardTitle>
            <p className="text-gray-600">Tell students about your expertise and teaching experience.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Mathematics Professor, Computer Science Expert"
                  value={profileData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell students about your teaching approach and passion for education..."
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Subjects You Teach</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a subject"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSubject())}
                  />
                  <Button type="button" onClick={addSubject}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                      {subject}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeSubject(subject)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="experience">Teaching Experience</Label>
                <Input
                  id="experience"
                  placeholder="e.g., 5+ years experience"
                  value={profileData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  placeholder="e.g., PhD in Mathematics, MS in Computer Science"
                  value={profileData.education}
                  onChange={(e) => handleInputChange("education", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="45.00"
                  value={profileData.hourlyRate}
                  onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., New York, NY or Online"
                  value={profileData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="availability">Availability</Label>
                <Input
                  id="availability"
                  placeholder="e.g., Mon-Fri 9AM-6PM"
                  value={profileData.availability}
                  onChange={(e) => handleInputChange("availability", e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setLocation("/")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={createProfileMutation.isPending}
                >
                  {createProfileMutation.isPending ? "Creating..." : "Create Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
