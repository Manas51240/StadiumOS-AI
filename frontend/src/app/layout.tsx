import React from 'react';
import type { Metadata } from 'next';
import '../styles/globals.css';
import { AuthProvider } from '@/core/context/AuthContext';
import { AccessibilityProvider } from '@/core/context/AccessibilityContext';
import Header from '@/shared/components/Header';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'StadiumOS AI - FIFA World Cup 2026',
  description: 'AI-Powered Stadium Operations Management System for FIFA World Cup 2026',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AccessibilityProvider>
            {/* WCAG 2.2 Skip Link */}
            <a href="#main-content-landmark" className="skip-link">
              Skip to Main Content
            </a>
            
            <Header />
            
            <main id="main-content-landmark" style={{ padding: '30px 0' }}>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
