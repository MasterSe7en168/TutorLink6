import { Button } from "@/components/ui/button";
import { Bell, MessageCircle } from "lucide-react";
import { useAuth } from "@/App";
import AuthModal from "./auth-modal";
import { useState } from "react";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">TutorMatch</h1>
              </div>
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                <a href="/" className="text-gray-900 hover:text-primary px-3 py-2 text-sm font-medium">Find Tutors</a>
                {isAuthenticated && (
                  <a href="/dashboard" className="text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium">Dashboard</a>
                )}
                <a href="/tutor-signup" className="text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium">Become a Tutor</a>
                <a href="#" className="text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium">How it Works</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" size="sm">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={user?.avatar || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"} 
                      alt="User profile" 
                      className="h-8 w-8 rounded-full" 
                    />
                    <span className="text-sm font-medium text-gray-700">{user?.fullName}</span>
                  </div>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => openAuthModal("login")}>
                    Log In
                  </Button>
                  <Button onClick={() => openAuthModal("signup")}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}
