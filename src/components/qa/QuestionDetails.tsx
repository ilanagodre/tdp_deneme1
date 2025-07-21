// src/components/qa/QuestionDetails.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Question, Vote } from '@/types/qa.types';
import { AnswerForm } from './AnswerForm';

interface QuestionDetailsProps {
  question: Question;
  currentUserId: number;
  onVote: (answerId: number, voteType: Vote['type']) => Promise<void>;
  onAnswer: (content: string) => Promise<void>;
}

export const QuestionDetails: React.FC<QuestionDetailsProps> = ({
  question,
  currentUserId,
  onVote,
  onAnswer,
}) => {
  const { t } = useLanguage();

  const getVoteCount = (votes: Vote[]) => {
    return votes.reduce((acc, vote) => {
      return acc + (vote.type === 'UP' ? 1 : -1);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{question.title}</CardTitle>
          <div className="flex gap-2">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap mb-4">{question.content}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {question.answers.length} {t('qa.answers')}
        </h3>

        {question.answers.map((answer) => (
          <Card key={answer.id}>
            <CardContent className="pt-6">
              <p className="whitespace-pre-wrap mb-4">{answer.content}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onVote(answer.id, 'UP')}
                    disabled={answer.authorId === currentUserId}
                  >
                    ▲
                  </Button>
                  <span>{getVoteCount(answer.votes)}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onVote(answer.id, 'DOWN')}
                    disabled={answer.authorId === currentUserId}
                  >
                    ▼
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <AnswerForm onSubmit={onAnswer} />
      </div>
    </div>
  );
};