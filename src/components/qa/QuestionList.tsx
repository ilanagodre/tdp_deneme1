// src/components/qa/QuestionList.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Question } from '@/types/qa.types';

interface QuestionListProps {
  questions: Question[];
  onSearch: (query: string) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({ questions, onSearch }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder={t('qa.search')}
          className="max-w-md"
          onChange={(e) => onSearch(e.target.value)}
        />
        <Button onClick={() => navigate('/qa/ask')}>{t('qa.ask')}</Button>
      </div>

      {questions.map((question) => (
        <Card
          key={question.id}
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate(`/qa/${question.id}`)}
        >
          <CardHeader>
            <CardTitle>{question.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-2 mb-4">{question.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {question.answers.length} {t('qa.answers')}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};