import React from 'react';

interface ChatHeaderProps {
  userRole: string;
  language: string;
  setLanguage: (val: string) => void;
}

export default function ChatHeader({ userRole, language, setLanguage }: ChatHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: '14px',
      borderBottom: '1px solid var(--border-glass)'
    }}>
      <div>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>StadiumOS AI Assistant</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
          Operational Mode: <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{userRole.toUpperCase()}</span>
        </p>
      </div>
      
      <div>
        <label htmlFor="language-select" className="sr-only">Select Help Language</label>
        <select
          id="language-select"
          className="form-input"
          style={{ padding: '6px 12px', fontSize: '0.85rem', width: '120px' }}
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="ar">العربية</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
    </div>
  );
}
