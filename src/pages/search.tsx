// src/pages/search.tsx
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ExpertSearchFilters from '../components/search/ExpertSearchFilters';
import ExpertList from '../components/search/ExpertList';
import { Expert } from '../types/user.types';
import api from '../services/api';

const SearchPage: React.FC = () => {
  const { t } = useLanguage();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const searchExperts = async (filters: any, reset = false) => {
    try {
      setLoading(true);
      const response = await api.get('/experts/search', {
        params: {
          ...filters,
          page: reset ? 1 : page,
        },
      });
      
      const newExperts = response.data.experts;
      setExperts(reset ? newExperts : [...experts, ...newExperts]);
      setHasMore(newExperts.length === 10); // Assuming 10 items per page
      if (!reset) {
        setPage(page + 1);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters: any) => {
    searchExperts(filters, true);
  };

  const handleLoadMore = () => {
    searchExperts({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('search.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <aside>
          <ExpertSearchFilters onFilter={handleFilter} />
        </aside>
        
        <main>
          <ExpertList
            experts={experts}
            loading={loading}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
          />
        </main>
      </div>
    </div>
  );
};

export default SearchPage;