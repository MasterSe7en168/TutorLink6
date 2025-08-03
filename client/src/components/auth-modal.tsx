import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  onModeChange: (mode: "login" | "signup") => void;
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    username: "",
    userType: "student" as "student" | "tutor"
  });
  
  const { setUser } = useAuth();
  const { toast } = useToast();

  const authMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const response = await apiRequest("POST", endpoint, data);
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user as User);
      toast({
        title: mode === "login" ? "Welcome back!" : "Account created!",
        description: mode === "login" ? "You have successfully logged in." : "Your account has been created successfully.",
      });
      onClose();
      setFormData({
        email: "",
        password: "",
        fullName: "",
        username: "",
        userType: "student"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "login") {
      authMutation.mutate({
        email: formData.email,
        password: formData.password
      });
    } else {
      authMutation.mutate({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        username: formData.username,
        userType: formData.userType
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "login" ? "Log In" : "Sign Up"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="userType">I am a</Label>
                <Select value={formData.userType} onValueChange={(value) => handleInputChange("userType", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="tutor">Tutor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90"
            disabled={authMutation.isPending}
          >
            {authMutation.isPending ? "Loading..." : (mode === "login" ? "Log In" : "Sign Up")}
          </Button>
        </form>
        
        <div className="text-center text-sm">
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button 
                type="button"
                className="text-primary hover:underline"
                onClick={() => onModeChange("signup")}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button 
                type="button"
                className="text-primary hover:underline"
                onClick={() => onModeChange("login")}
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
