import React from 'react';
import { Eye, Type, Volume2 } from 'lucide-react';

interface A11yControlsProps {
  toggleTheme: () => void;
  handleFontSizeChange: () => void;
  toggleAudioGuide: () => void;
  audioGuideActive: boolean;
}

export default function A11yControls({
  toggleTheme,
  handleFontSizeChange,
  toggleAudioGuide,
  audioGuideActive
}: A11yControlsProps) {
  return (
    <>
      <button
        onClick={toggleTheme}
        className="btn btn-secondary"
        style={{ padding: '6px 10px', fontSize: '0.8rem' }}
        title="Toggle contrast theme"
        aria-label="Toggle Contrast Theme"
      >
        <Eye size={14} />
        <span className="sr-only">Contrast Theme</span>
      </button>
      
      <button
        onClick={handleFontSizeChange}
        className="btn btn-secondary"
        style={{ padding: '6px 10px', fontSize: '0.8rem' }}
        title="Adjust text size"
        aria-label="Adjust Text Size"
      >
        <Type size={14} />
        <span className="sr-only">Font Scale</span>
      </button>

      <button
        onClick={toggleAudioGuide}
        className="btn btn-secondary"
        style={{
          padding: '6px 10px',
          fontSize: '0.8rem',
          borderColor: audioGuideActive ? 'var(--color-primary)' : 'var(--border-glass)',
          color: audioGuideActive ? 'var(--color-primary)' : 'var(--text-primary)'
        }}
        title="Toggle audio guide assistant"
        aria-label="Toggle Audio Guide"
      >
        <Volume2 size={14} />
        <span className="sr-only">Audio Guide</span>
      </button>
    </>
  );
}
