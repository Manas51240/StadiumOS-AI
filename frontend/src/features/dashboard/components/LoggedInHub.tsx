import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Compass, MessageSquare, Users, AlertTriangle } from 'lucide-react';
import { UserProfile } from '../../../core/types';

interface LoggedInHubProps {
  user: UserProfile;
}

export default function LoggedInHub({ user }: LoggedInHubProps) {
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
