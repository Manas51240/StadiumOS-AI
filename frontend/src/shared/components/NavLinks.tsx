import React from 'react';
import Link from 'next/link';
import { Compass, ShieldAlert, Users, Volume2 } from 'lucide-react';
import { UserProfile } from '../../core/types';

interface NavLinksProps {
  user: UserProfile;
  pathname: string;
}

export default function NavLinks({ user, pathname }: NavLinksProps) {
  return (
    <nav aria-label="Main Navigation" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {(user.role === 'organizer' || user.role === 'security') && (
        <Link
          href="/dashboard"
          style={{
            color: pathname === '/dashboard' ? 'var(--text-primary)' : 'var(--text-secondary)',
            background: pathname === '/dashboard' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
            padding: '8px 12px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          Dashboard
        </Link>
      )}

      <Link
        href="/navigation"
        style={{
          color: pathname === '/navigation' ? 'var(--text-primary)' : 'var(--text-secondary)',
          background: pathname === '/navigation' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          padding: '8px 12px',
          borderRadius: '4px',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.85rem',
          fontWeight: 600
        }}
      >
        <Compass size={14} />
        Navigation
      </Link>

      <Link
        href="/assistant"
        style={{
          color: pathname === '/assistant' ? 'var(--text-primary)' : 'var(--text-secondary)',
          background: pathname === '/assistant' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          padding: '8px 12px',
          borderRadius: '4px',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.85rem',
          fontWeight: 600
        }}
      >
        <Volume2 size={14} />
        AI Support
      </Link>

      <Link
        href="/volunteer"
        style={{
          color: pathname === '/volunteer' ? 'var(--text-primary)' : 'var(--text-secondary)',
          background: pathname === '/volunteer' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          padding: '8px 12px',
          borderRadius: '4px',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.85rem',
          fontWeight: 600
        }}
      >
        <Users size={14} />
        Volunteers
      </Link>

      <Link
        href="/emergency"
        style={{
          color: pathname === '/emergency' ? 'var(--text-primary)' : 'var(--text-secondary)',
          background: pathname === '/emergency' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          padding: '8px 12px',
          borderRadius: '4px',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.85rem',
          fontWeight: 600
        }}
      >
        <ShieldAlert size={14} />
        Emergency
      </Link>
    </nav>
  );
}
