'use client';

import React from 'react';
import { useAuth } from '@/core/context/AuthContext';
import LoggedInHub from '../features/dashboard/components/LoggedInHub';
import { UserProfile } from '@/core/types';

const DEFAULT_USER: UserProfile = {
  id: 1,
  email: 'manasdeshmukh512@gmail.com',
  full_name: 'Manas Deshmukh',
  role: 'organizer',
  is_active: true,
  created_at: new Date().toISOString()
};

export default function Home() {
  const { user } = useAuth();
  
  return <LoggedInHub user={user || DEFAULT_USER} />;
}
