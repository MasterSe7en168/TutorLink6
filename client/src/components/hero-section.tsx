import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useState } from "react";

interface HeroSectionProps {
  onSearch: (filters: { subject: string; location: string; level: string }) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    onSearch({ subject, level, location });
  };

  return (
    <section className="gradient-primary text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Find the Perfect Tutor</h2>
          <p className="text-xl mb-8 text-teal-100">Connect with expert tutors and learn any subject, anytime, anywhere</p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Languages">Languages</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="College">College</SelectItem>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Location</Label>
                <Input 
                  type="text" 
                  placeholder="City or Online" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search Tutors
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
