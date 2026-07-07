'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ContrastTheme = 'dark' | 'high-contrast';
type FontSize = 'normal' | 'large' | 'extra-large';

interface AccessibilityContextType {
  theme: ContrastTheme;
  fontSize: FontSize;
  announcement: string;
  audioGuideActive: boolean;
  toggleTheme: () => void;
  setFontSize: (size: FontSize) => void;
  announce: (message: string) => void;
  toggleAudioGuide: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ContrastTheme>('dark');
  const [fontSize, setFontSizeState] = useState<FontSize>('normal');
  const [announcement, setAnnouncement] = useState('');
  const [audioGuideActive, setAudioGuideActive] = useState(false);

  useEffect(() => {
    // Re-hydrate accessibility preferences
    const savedTheme = localStorage.getItem('access_theme') as ContrastTheme;
    const savedSize = localStorage.getItem('access_size') as FontSize;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    if (savedSize) {
      setFontSizeState(savedSize);
      document.documentElement.setAttribute('data-font-size', savedSize);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'high-contrast' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('access_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    announce(`Theme changed to ${nextTheme === 'high-contrast' ? 'High Contrast Mode' : 'Standard Dark Mode'}`);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem('access_size', size);
    document.documentElement.setAttribute('data-font-size', size);
    announce(`Text scale changed to ${size}`);
  };

  const announce = (message: string) => {
    setAnnouncement(message);
    // Clear after timeout so repeat announcements fire
    setTimeout(() => setAnnouncement(''), 3000);
  };

  const toggleAudioGuide = () => {
    const nextState = !audioGuideActive;
    setAudioGuideActive(nextState);
    announce(nextState ? "Audio accessibility guide enabled" : "Audio accessibility guide disabled");
  };

  return (
    <AccessibilityContext.Provider
      value={{
        theme,
        fontSize,
        announcement,
        audioGuideActive,
        toggleTheme,
        setFontSize,
        announce,
        toggleAudioGuide
      }}
    >
      {children}
      {/* Hidden screen reader live region (WCAG 2.2 Requirement) */}
      <div
        id="sr-live-region"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}
