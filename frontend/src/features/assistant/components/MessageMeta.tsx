import React from 'react';
import { Volume2, ShieldCheck, Cpu } from 'lucide-react';

interface MessageMetaProps {
  confidence?: number;
  intent?: string;
  content: string;
  speakText: (text: string) => void;
}

export default function MessageMeta({ confidence, intent, content, speakText }: MessageMetaProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      marginTop: '4px',
      fontSize: '0.78rem',
      color: 'var(--text-muted)',
      paddingLeft: '4px'
    }}>
      {confidence !== undefined && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Cpu size={12} />
          Confidence: {Math.round(confidence * 100)}%
        </span>
      )}
      
      {intent && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={12} color="var(--color-primary)" />
          Intent: {intent.toUpperCase()}
        </span>
      )}

      <button
        onClick={() => speakText(content)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: 0
        }}
        aria-label="Speak text response"
      >
        <Volume2 size={12} />
      </button>
    </div>
  );
}
