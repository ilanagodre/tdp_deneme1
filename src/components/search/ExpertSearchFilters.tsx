// src/components/search/ExpertSearchFilters.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchFilters {
  skills: string[];
  availability: string;
  languages: string[];
  hourlyRateRange: {
    min: number;
    max: number;
  };
}

interface ExpertSearchFiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

export const ExpertSearchFilters: React.FC<ExpertSearchFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    onFilterChange({ ...filters, skills });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="skills">Skills (comma-separated)</Label>
          <Input
            id="skills"
            value={filters.skills.join(', ')}
            onChange={handleSkillsChange}
            placeholder="React, TypeScript, Node.js"
          />
        </div>

        <div className="space-y-2">
          <Label>Availability</Label>
          <Select
            value={filters.availability}
            onValueChange={(value) => onFilterChange({ ...filters, availability: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AVAILABLE">Available Now</SelectItem>
              <SelectItem value="BUSY">Busy</SelectItem>
              <SelectItem value="ALL">All</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minRate">Min Rate ($/hr)</Label>
            <Input
              id="minRate"
              type="number"
              value={filters.hourlyRateRange.min}
              onChange={(e) => onFilterChange({
                ...filters,
                hourlyRateRange: { ...filters.hourlyRateRange, min: Number(e.target.value) }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxRate">Max Rate ($/hr)</Label>
            <Input
              id="maxRate"
              type="number"
              value={filters.hourlyRateRange.max}
              onChange={(e) => onFilterChange({
                ...filters,
                hourlyRateRange: { ...filters.hourlyRateRange, max: Number(e.target.value) }
              })}
            />
          </div>
        </div>

        <Button
          onClick={() => onFilterChange({
            skills: [],
            availability: 'ALL',
            languages: [],
            hourlyRateRange: { min: 0, max: 1000 }
          })}
          variant="outline"
          className="w-full"
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};