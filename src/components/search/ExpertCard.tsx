// src/components/search/ExpertCard.tsx
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Expert } from '../../types/user.types';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface ExpertCardProps {
  expert: Expert;
  onContact: (expertId: string) => void;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert, onContact }) => {
  const { t } = useLanguage();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${expert.id}`} />
          <AvatarFallback>{expert.firstName[0]}{expert.lastName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{`${expert.firstName} ${expert.lastName}`}</h3>
          <p className="text-sm text-muted-foreground">{expert.location}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {expert.expertise.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
          <p className="text-sm mt-2">{expert.biography?.slice(0, 150)}...</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                ${expert.hourlyRate}/hr
              </span>
              <span className="text-sm text-muted-foreground">
                • {expert.rating.toFixed(1)} ⭐
              </span>
            </div>
            <Button onClick={() => onContact(expert.id)}>
              {t('expert.contact')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertCard;