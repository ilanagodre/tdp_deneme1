// src/pages/experts.tsx
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ExpertSearchFilters } from '@/components/search/ExpertSearchFilters';
import { ExpertList } from '@/components/search/ExpertList';
import { storage } from '@/services/storage';
import { ExpertProfile } from '@/types/user.types';

const ExpertsPage: React.FC = () => {
  const [filters, setFilters] = React.useState({
    skills: [],
    availability: 'ALL',
    languages: [],
    hourlyRateRange: { min: 0, max: 1000 },
  });

  const [experts, setExperts] = React.useState<ExpertProfile[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  React.useEffect(() => {
    loadExperts();
  }, [filters]);

  const loadExperts = () => {
    // In a real app, this would be an API call with pagination
    // For now, we'll simulate with localStorage
    const allExperts = storage.getAllExperts();
    const filtered = allExperts.filter((expert) => {
      if (filters.availability !== 'ALL' && expert.availability.status !== filters.availability) {
        return false;
      }
      
      if (filters.skills.length > 0) {
        const expertSkills = expert.skills.map(s => s.name.toLowerCase());
        if (!filters.skills.every(skill => 
          expertSkills.includes(skill.toLowerCase())
        )) {
          return false;
        }
      }

      if (expert.hourlyRate < filters.hourlyRateRange.min || 
          expert.hourlyRate > filters.hourlyRateRange.max) {
        return false;
      }

      return true;
    });

    setExperts(filtered);
    setHasMore(false); // For localStorage implementation
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Find Experts</h1>
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-1">
            <ExpertSearchFilters
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>
          <div className="col-span-3">
            <ExpertList
              experts={experts}
              onLoadMore={() => setPage(p => p + 1)}
              hasMore={hasMore}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExpertsPage;