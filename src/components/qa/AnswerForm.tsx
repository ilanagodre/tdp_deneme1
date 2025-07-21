// src/components/qa/AnswerForm.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface AnswerFormProps {
  onSubmit: (content: string) => Promise<void>;
}

export const AnswerForm: React.FC<AnswerFormProps> = ({ onSubmit }) => {
  const { t } = useLanguage();
  const [content, setContent] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      await onSubmit(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{t('qa.your_answer')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder={t('qa.your_answer')}
          />
          <Button type="submit" className="w-full">
            {t('qa.submit_answer')}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};