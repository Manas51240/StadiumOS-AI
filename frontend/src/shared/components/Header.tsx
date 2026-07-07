'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/core/context/AuthContext';
import { useAccessibility } from '@/core/context/AccessibilityContext';
import { Compass, ShieldAlert, Users, LogOut, Volume2, ChevronRight } from 'lucide-react';
import A11yControls from './A11yControls';

export default function Header() {
  const { user, logout } = useAuth();
  const { toggleTheme, fontSize, setFontSize, audioGuideActive, toggleAudioGuide } = useAccessibility();
  const pathname = usePathname();

  const handleFontSizeChange = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('extra-large');
    else setFontSize('normal');
  };

  const getBreadcrumbs = () => {
    if (pathname === '/') return 'Gateway';
    const clean = pathname.replace('/', '');
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  return (
    <header style={{
      borderBottom: '1px solid var(--border-glass)',
      background: 'rgba(10, 15, 30, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '60px'
      }}>
        {/* Brand & Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{
            fontSize: '1.2rem',
            fontWeight: 800,
            textDecoration: 'none',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'black',
              fontWeight: 900,
              fontSize: '0.9rem'
            }}>S</span>
            StadiumOS
          </Link>
          <ChevronRight size={14} color="var(--text-muted)" />
          <span style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px 10px',
            borderRadius: '4px',
            border: '1px solid var(--border-glass)'
          }}>
            {getBreadcrumbs()}
          </span>
        </div>

        {/* Navigation Links */}
        {user && (
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
        )}

        {/* Quick actions controls */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <A11yControls
            toggleTheme={toggleTheme}
            handleFontSizeChange={handleFontSizeChange}
            toggleAudioGuide={toggleAudioGuide}
            audioGuideActive={audioGuideActive}
          />
          {user && (
            <button
              onClick={logout}
              className="btn btn-secondary"
              style={{
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                marginLeft: '12px'
              }}
              aria-label="Log Out Account"
            >
              <LogOut size={12} />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
