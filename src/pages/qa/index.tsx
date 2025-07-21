// src/pages/qa/index.tsx
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { QuestionList } from '@/components/qa/QuestionList';
import { storage } from '@/services/storage';
import { Question } from '@/types/qa.types';
import { useLanguage } from '@/contexts/LanguageContext';

const QAPage: React.FC = () => {
  const { t } = useLanguage();
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    const allQuestions = storage.getAllQuestions();
    setQuestions(allQuestions);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const allQuestions = storage.getAllQuestions();
    const filtered = allQuestions.filter(
      (q) =>
        q.title.toLowerCase().includes(query.toLowerCase()) ||
        q.content.toLowerCase().includes(query.toLowerCase()) ||
        q.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    );
    setQuestions(filtered);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">{t('qa.title')}</h1>
        <QuestionList questions={questions} onSearch={handleSearch} />
      </div>
    </DashboardLayout>
  );
};

export default QAPage;