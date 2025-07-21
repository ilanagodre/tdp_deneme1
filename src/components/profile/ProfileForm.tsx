// src/components/profile/ProfileForm.tsx
import React from 'react';
import { useForm, UseFormRegister, FieldErrors } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ExpertProfile, CustomerProfile, UserProfile } from '@/types/user.types';

interface ProfileFormProps {
  profile: UserProfile;
  onSubmit: (data: Partial<UserProfile>) => Promise<void>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: profile,
  });

  const isExpert = profile.role === 'EXPERT';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register('firstName', { required: 'First name is required' })}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register('lastName', { required: 'Last name is required' })}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {isExpert ? (
        <ExpertProfileFields profile={profile as ExpertProfile} register={register} errors={errors} />
      ) : (
        <CustomerProfileFields profile={profile as CustomerProfile} register={register} errors={errors} />
      )}

      <Button type="submit" className="w-full">
        Save Changes
      </Button>
    </form>
  );
};

const ExpertProfileFields: React.FC<{
  profile: ExpertProfile;
  register: UseFormRegister<ExpertProfile>;
  errors: FieldErrors<ExpertProfile>;
}> = ({ register, errors }) => (
  <>
    <Card>
      <CardHeader>
        <CardTitle>Expertise</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bio">Professional Bio</Label>
          <Textarea
            id="bio"
            {...register('bio', { required: 'Bio is required' })}
          />
          {errors.bio && (
            <p className="text-sm text-red-500">{errors.bio.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
          <Input
            id="hourlyRate"
            type="number"
            {...register('hourlyRate', {
              required: 'Hourly rate is required',
              min: { value: 0, message: 'Hourly rate must be positive' },
            })}
          />
          {errors.hourlyRate && (
            <p className="text-sm text-red-500">{errors.hourlyRate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Availability Status</Label>
          <Select
            {...register('availability.status', {
              required: 'Availability status is required',
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AVAILABLE">Available</SelectItem>
              <SelectItem value="BUSY">Busy</SelectItem>
              <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  </>
);

const CustomerProfileFields: React.FC<{
  profile: CustomerProfile;
  register: UseFormRegister<CustomerProfile>;
  errors: FieldErrors<CustomerProfile>;
}> = ({ register, errors }) => (
  <Card>
    <CardHeader>
      <CardTitle>Company Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="company.name">Company Name</Label>
        <Input
          id="company.name"
          {...register('company.name', { required: 'Company name is required' })}
        />
        {errors.company?.name && (
          <p className="text-sm text-red-500">{errors.company.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company.position">Position</Label>
        <Input
          id="company.position"
          {...register('company.position', { required: 'Position is required' })}
        />
        {errors.company?.position && (
          <p className="text-sm text-red-500">{errors.company.position.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company.industry">Industry</Label>
        <Input
          id="company.industry"
          {...register('company.industry', { required: 'Industry is required' })}
        />
        {errors.company?.industry && (
          <p className="text-sm text-red-500">{errors.company.industry.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Company Size</Label>
        <Select
          {...register('company.size', {
            required: 'Company size is required',
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select company size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="STARTUP">Startup</SelectItem>
            <SelectItem value="SMB">Small/Medium Business</SelectItem>
            <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  </Card>
);