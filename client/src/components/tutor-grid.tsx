import { useQuery } from "@tanstack/react-query";
import { TutorWithProfile } from "@shared/schema";
import TutorCard from "./tutor-card";
import { Button } from "@/components/ui/button";
import { Grid, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TutorGridProps {
  filters: {
    subject: string;
    location: string;
    level: string;
  };
}

export default function TutorGrid({ filters }: TutorGridProps) {
  const { data: tutors, isLoading } = useQuery<TutorWithProfile[]>({
    queryKey: ["/api/tutors", filters],
    enabled: true,
  });

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Featured Tutors</h3>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm">
                <Grid className="mr-2 h-4 w-4" />
                Grid
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900">
            {filters.subject ? `${filters.subject} Tutors` : "Featured Tutors"}
          </h3>
          <div className="flex space-x-4">
            <Button variant="outline" size="sm">
              <Grid className="mr-2 h-4 w-4" />
              Grid
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {tutors && tutors.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline">
                Load More Tutors
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tutors found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search filters.</p>
          </div>
        )}
      </div>
    </section>
  );
}
