// src/pages/qa/[id].tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { QuestionDetails } from '@/components/qa/QuestionDetails';
import { storage } from '@/services/storage';
import { useAuth } from '@/contexts/AuthContext';
import { Vote } from '@/types/qa.types';

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const question = storage.getQuestionById(Number(id));

  const handleVote = async (answerId: number, voteType: Vote['type']) => {
    if (!question || !user) return;

    const updatedQuestion = {
      ...question,
      answers: question.answers.map((answer) => {
        if (answer.id === answerId) {
          const existingVoteIndex = answer.votes.findIndex(
            (v) => v.userId === user.id
          );

          if (existingVoteIndex >= 0) {
            // Update existing vote
            const updatedVotes = [...answer.votes];
            updatedVotes[existingVoteIndex] = {
              userId: user.id,
              type: voteType,
            };
            return { ...answer, votes: updatedVotes };
          } else {
            // Add new vote
            return {
              ...answer,
              votes: [...answer.votes, { userId: user.id, type: voteType }],
            };
          }
        }
        return answer;
      }),
    };

    storage.updateQuestion(updatedQuestion);
  };

  const handleAnswer = async (content: string) => {
    if (!question || !user) return;

    const newAnswer = {
      id: Date.now(),
      questionId: question.id,
      authorId: user.id,
      content,
      votes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedQuestion = {
      ...question,
      answers: [...question.answers, newAnswer],
    };

    storage.updateQuestion(updatedQuestion);
  };

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <QuestionDetails
          question={question}
          currentUserId={user?.id || 0}
          onVote={handleVote}
          onAnswer={handleAnswer}
        />
      </div>
    </DashboardLayout>
  );
};

export default QuestionDetailPage;