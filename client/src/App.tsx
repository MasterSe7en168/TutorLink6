import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import TutorSignup from "@/pages/tutor-signup";
import StudentSignup from "@/pages/student-signup";
import Profile from "@/pages/profile";
import Dashboard from "@/pages/dashboard";
import Membership from "@/pages/membership";
import { useState, createContext, useContext } from "react";
import { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/tutor-signup" component={TutorSignup} />
      <Route path="/student-signup" component={StudentSignup} />
      <Route path="/profile/:id" component={Profile} />
      <Route path="/membership" component={Membership} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated: !!user 
    }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}

export default App;
