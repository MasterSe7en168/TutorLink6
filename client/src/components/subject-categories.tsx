import { useQuery } from "@tanstack/react-query";
import { Calculator, FlaskConical, Code, Languages, Book, Landmark } from "lucide-react";

interface Subject {
  name: string;
  icon: string;
  count: number;
}

interface SubjectCategoriesProps {
  onSubjectSelect: (subject: string) => void;
}

const iconMap = {
  calculator: Calculator,
  flask: FlaskConical,
  code: Code,
  language: Languages,
  book: Book,
  landmark: Landmark,
};

export default function SubjectCategories({ onSubjectSelect }: SubjectCategoriesProps) {
  const { data: subjects, isLoading } = useQuery<Subject[]>({
    queryKey: ["/api/subjects"],
  });

  if (isLoading) {
    return (
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Popular Subjects</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mx-auto mb-1"></div>
                <div className="h-3 bg-gray-200 rounded mx-auto w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Popular Subjects</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {subjects?.map((subject, index) => {
            const IconComponent = iconMap[subject.icon as keyof typeof iconMap] || Calculator;
            const colors = [
              "bg-blue-100 text-blue-600",
              "bg-green-100 text-green-600", 
              "bg-purple-100 text-purple-600",
              "bg-yellow-100 text-yellow-600",
              "bg-red-100 text-red-600",
              "bg-indigo-100 text-indigo-600"
            ];
            
            return (
              <div 
                key={subject.name}
                className="text-center p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition duration-200"
                onClick={() => onSubjectSelect(subject.name)}
              >
                <div className={`w-12 h-12 ${colors[index % colors.length]} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-gray-900">{subject.name}</span>
                <p className="text-xs text-gray-500 mt-1">{subject.count} tutors</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
