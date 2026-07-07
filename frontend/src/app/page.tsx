'use client';

import React, { useState } from 'react';
import { useAuth } from '@/core/context/AuthContext';
import AuthForm from '../features/auth/components/AuthForm';
import LoggedInHub from '../features/dashboard/components/LoggedInHub';

export default function Home() {
  const { user, login, signup, loading } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'spectator' | 'volunteer' | 'security' | 'organizer'>('spectator');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (!success) {
          setErrorMsg('Invalid email or password. Hint: You must sign up an account first!');
        }
      } else {
        const success = await signup(email, password, fullName, role);
        if (success) {
          setSuccessMsg('Account registered successfully! You can now log in.');
          setIsLogin(true);
          setPassword('');
        } else {
          setErrorMsg('Failed to register account. Check if email is already in use.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Operation failed');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Loading StadiumOS AI Platform...</h2>
      </div>
    );
  }

  if (user) {
    return <LoggedInHub user={user} />;
  }

  return (
    <AuthForm
      isLogin={isLogin}
      setIsLogin={setIsLogin}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      fullName={fullName}
      setFullName={setFullName}
      role={role}
      setRole={setRole}
      errorMsg={errorMsg}
      setErrorMsg={setErrorMsg}
      successMsg={successMsg}
      setSuccessMsg={setSuccessMsg}
      handleSubmit={handleSubmit}
    />
  );
}
