// src/pages/profile.tsx
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { storage } from '@/services/storage';
import { UserProfile } from '@/types/user.types';

export const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();

  const handleProfileUpdate = async (data: Partial<UserProfile>) => {
    try {
      const updatedProfile = storage.updateUserProfile(data);
      if (!updatedProfile) {
        throw new Error('Failed to update profile');
      }
      // TODO: Implement API call to update profile on server
      // For now, we're just updating localStorage
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        <ProfileForm profile={user as unknown as UserProfile} onSubmit={handleProfileUpdate} />
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;