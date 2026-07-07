import React from 'react';

interface SuggestedActionsProps {
  actions: string[];
  handleSend: (text: string) => void;
}

export default function SuggestedActions({ actions, handleSend }: SuggestedActionsProps) {
  if (!actions || actions.length === 0) return null;
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      marginTop: '8px',
      flexWrap: 'wrap'
    }}>
      {actions.map((act, actIdx) => (
        <button
          key={actIdx}
          onClick={() => handleSend(act)}
          className="btn btn-secondary"
          style={{
            padding: '4px 10px',
            fontSize: '0.78rem',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.05)'
          }}
        >
          {act}
        </button>
      ))}
    </div>
  );
}
