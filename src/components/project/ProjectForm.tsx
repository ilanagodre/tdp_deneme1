// src/components/project/ProjectForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project } from '@/types/project.types';

interface ProjectFormProps {
  onSubmit: (data: Partial<Project>) => Promise<void>;
  initialData?: Partial<Project>;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget.min">Minimum Budget</Label>
              <Input
                id="budget.min"
                type="number"
                {...register('budget.min', { required: 'Minimum budget is required' })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget.max">Maximum Budget</Label>
              <Input
                id="budget.max"
                type="number"
                {...register('budget.max', { required: 'Maximum budget is required' })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Duration</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                {...register('duration.estimate', { required: 'Duration is required' })}
              />
              <Select {...register('duration.unit')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAYS">Days</SelectItem>
                  <SelectItem value="WEEKS">Weeks</SelectItem>
                  <SelectItem value="MONTHS">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        {initialData ? 'Update Project' : 'Create Project'}
      </Button>
    </form>
  );
};