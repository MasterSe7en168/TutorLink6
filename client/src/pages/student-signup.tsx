import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function StudentSignup() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Student Signup</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Student registration is handled through the main signup flow. 
            Click below to return to the home page and sign up as a student.
          </p>
          <Button 
            className="w-full bg-primary hover:bg-primary/90" 
            onClick={() => setLocation("/")}
          >
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
