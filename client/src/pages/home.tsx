import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import TutorGrid from "@/components/tutor-grid";
import SubjectCategories from "@/components/subject-categories";
import { useState } from "react";

export default function Home() {
  const [searchFilters, setSearchFilters] = useState({
    subject: "",
    location: "",
    level: ""
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection onSearch={setSearchFilters} />
      <TutorGrid filters={searchFilters} />
      <SubjectCategories onSubjectSelect={(subject) => setSearchFilters(prev => ({ ...prev, subject }))} />
      
      {/* Become a Tutor Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">Become a Tutor</h3>
            <p className="text-xl text-gray-300 mb-8">Share your knowledge and earn money teaching students worldwide</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user-plus text-2xl"></i>
                </div>
                <h4 className="text-lg font-semibold mb-2">Sign Up</h4>
                <p className="text-gray-400">Create your tutor profile in minutes</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-calendar-alt text-2xl"></i>
                </div>
                <h4 className="text-lg font-semibold mb-2">Set Schedule</h4>
                <p className="text-gray-400">Choose when and how you want to teach</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-dollar-sign text-2xl"></i>
                </div>
                <h4 className="text-lg font-semibold mb-2">Start Earning</h4>
                <p className="text-gray-400">Get paid for sharing your expertise</p>
              </div>
            </div>
            <a href="/tutor-signup" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-200">
              Get Started as a Tutor
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-bold text-gray-900 mb-4">TutorMatch</h5>
              <p className="text-gray-600 text-sm">Connecting passionate tutors with eager students for personalized learning experiences.</p>
            </div>
            <div>
              <h6 className="text-sm font-semibold text-gray-900 mb-4">For Students</h6>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">Find Tutors</a></li>
                <li><a href="#" className="hover:text-primary">How it Works</a></li>
                <li><a href="#" className="hover:text-primary">Pricing</a></li>
                <li><a href="#" className="hover:text-primary">Student Reviews</a></li>
              </ul>
            </div>
            <div>
              <h6 className="text-sm font-semibold text-gray-900 mb-4">For Tutors</h6>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/tutor-signup" className="hover:text-primary">Become a Tutor</a></li>
                <li><a href="#" className="hover:text-primary">Tutor Resources</a></li>
                <li><a href="#" className="hover:text-primary">Success Stories</a></li>
                <li><a href="#" className="hover:text-primary">Community</a></li>
              </ul>
            </div>
            <div>
              <h6 className="text-sm font-semibold text-gray-900 mb-4">Support</h6>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary">Safety</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">&copy; 2024 TutorMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
