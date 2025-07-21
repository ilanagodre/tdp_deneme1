// src/components/search/ExpertList.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExpertProfile } from '@/types/user.types';

interface ExpertListProps {
  experts: ExpertProfile[];
  onLoadMore: () => void;
  hasMore: boolean;
}

export const ExpertList: React.FC<ExpertListProps> = ({ experts, onLoadMore, hasMore }) => {
  return (
    <div className="space-y-4">
      {experts.map((expert) => (
        <Card key={expert.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{`${expert.firstName} ${expert.lastName}`}</CardTitle>
                <p className="text-sm text-muted-foreground">${expert.hourlyRate}/hr</p>
              </div>
              <Badge
                variant={expert.availability.status === 'AVAILABLE' ? 'success' : 'secondary'}
              >
                {expert.availability.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{expert.bio}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {expert.skills.map((skill) => (
                <Badge key={skill.id} variant="outline">
                  {skill.name}
                </Badge>
              ))}
            </div>
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </CardContent>
        </Card>
      ))}
      
      {hasMore && (
        <Button
          onClick={onLoadMore}
          variant="outline"
          className="w-full mt-4"
        >
          Load More
        </Button>
      )}
    </div>
  );
};