// src/components/qa/QuestionForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Question } from '@/types/qa.types';

interface QuestionFormProps {
  onSubmit: (data: Partial<Question>) => Promise<void>;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit }) => {
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>{t('qa.ask')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('qa.title')}</Label>
            <Input
              id="title"
              {...register('title', { required: true })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">Title is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{t('qa.your_answer')}</Label>
            <Textarea
              id="content"
              {...register('content', { required: true })}
              rows={6}
            />
            {errors.content && (
              <p className="text-sm text-destructive">Content is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              {...register('tags')}
              placeholder="react, typescript, nodejs"
            />
          </div>

          <Button type="submit" className="w-full">
            {t('common.submit')}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};