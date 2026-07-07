'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/core/context/AuthContext';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const ChatWidget = dynamic(() => import('../../features/assistant/components/ChatWidget'), {
  ssr: false,
  loading: () => <div className="skeleton" style={{ width: '100%', height: '500px' }} />
});

export default function AssistantPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Loading Multilingual Support...</h2>
      </div>
    );
  }

  return (
    <div className="container animated-fade">
      <div style={{ marginBottom: '24px' }}>
        <h1>AI Multilingual Assistant</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Access real-time World Cup stadium assistance. Select your language below to ask questions about scheduling, rules, or amenities.
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <ChatWidget />
      </div>
    </div>
  );
}
