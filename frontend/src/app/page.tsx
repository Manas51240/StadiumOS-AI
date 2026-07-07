'use client';

import React, { useState } from 'react';
import { useAuth } from '@/core/context/AuthContext';
import Link from 'next/link';
import { ShieldCheck, Compass, MessageSquare, Users, AlertTriangle } from 'lucide-react';
import AuthForm from '../features/auth/components/AuthForm';

export default function Home() {
  const { user, login, signup, loading } = useAuth();
  
  // Login / Signup Form states
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

  // Logged In Hub
  if (user) {
    return (
      <div className="container animated-fade">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ marginBottom: '10px' }}>StadiumOS AI Operational Portal</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
            FIFA World Cup 2026 Stadium Operations Copilot. You are currently logged in as{' '}
            <strong style={{ color: 'var(--color-primary)' }}>{user.full_name || user.email}</strong> with the security role{' '}
            <strong style={{ color: 'var(--color-secondary)' }}>{user.role.toUpperCase()}</strong>.
          </p>
        </div>

        <div className="dashboard-grid">
          {/* AI Multilingual Chat */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <MessageSquare size={36} color="var(--color-primary)" />
            <h3>Multilingual Assistant</h3>
            <p style={{ fontSize: '0.9rem', flex: 1 }}>
              Leverage the LLM service layer with conversation memory, language overrides, and security protection to request help.
            </p>
            <Link href="/assistant" className="btn btn-primary" style={{ width: '100%' }}>
              Launch Chat
            </Link>
          </div>

          {/* Interactive Routing Map */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Compass size={36} color="var(--color-secondary)" />
            <h3>Stadium Navigation</h3>
            <p style={{ fontSize: '0.9rem', flex: 1 }}>
              Plan dynamic step-free routing, avoid congested gates, and trace physical location nodes.
            </p>
            <Link href="/navigation" className="btn btn-primary" style={{ width: '100%' }}>
              Open Map
            </Link>
          </div>

          {/* Volunteer Hub */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Users size={36} color="var(--color-primary)" />
            <h3>Volunteer Hub</h3>
            <p style={{ fontSize: '0.9rem', flex: 1 }}>
              Inspect match shifts, claim tasks, log local sector conditions, and coordinate security operations.
            </p>
            <Link href="/volunteer" className="btn btn-primary" style={{ width: '100%' }}>
              Manage Tasks
            </Link>
          </div>

          {/* Emergency Center */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <AlertTriangle size={36} color="var(--color-accent)" />
            <h3>Emergency Operations</h3>
            <p style={{ fontSize: '0.9rem', flex: 1 }}>
              Log security/medical incidents, request dispatcher instructions, and track evacuation safety.
            </p>
            <Link href="/emergency" className="btn btn-danger" style={{ width: '100%' }}>
              Emergency Hub
            </Link>
          </div>
        </div>

        {/* Organizer/Security dashboards */}
        {(user.role === 'organizer' || user.role === 'security') && (
          <div className="glass-panel" style={{ marginTop: '30px', textAlign: 'center', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
            <ShieldCheck size={36} color="var(--color-secondary)" style={{ margin: '0 auto 10px' }} />
            <h3>Organizer Command Center</h3>
            <p style={{ maxWidth: '600px', margin: '0 auto 16px', fontSize: '0.9rem' }}>
              Access consolidated crowd metrics, real-time security alerts, sustainability dashboards, and trigger AI operational reports.
            </p>
            <Link href="/dashboard" className="btn btn-secondary">
              Enter Command Center
            </Link>
          </div>
        )}
      </div>
    );
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
