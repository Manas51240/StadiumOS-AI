'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../core/context/AuthContext';
import { useAccessibility } from '../../../core/context/AccessibilityContext';
import { Send } from 'lucide-react';
import MessageItem, { Message } from './MessageItem';
import { assistantService } from '../../../services/api';

export default function ChatWidget() {
  const { user } = useAuth();
  const { announce, audioGuideActive } = useAccessibility();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to StadiumOS AI Multilingual Support. How can I assist you with stadium operations, accessibility routing, shifts, or crowd rules today?',
      confidence: 1.0,
      suggested_actions: ['Where is Elevator 3?', 'What are the sustainability targets?', 'Check volunteer duties'],
      intent: 'general',
      tool_calls: []
    }
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    const userMsg: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    announce(`User sent query: ${messageText}`);

    try {
      const response = await assistantService.chat({
        message: messageText,
        language: language,
        conversation_id: 'active-session-wc-2026'
      });

      const assistantMsg: Message = {
        role: 'assistant',
        content: response.reply,
        confidence: response.confidence_score,
        flagged: response.flagged,
        flag_reason: response.flag_reason,
        suggested_actions: response.suggested_actions,
        intent: response.intent,
        tool_calls: response.tool_calls
      };

      setMessages(prev => [...prev, assistantMsg]);
      announce(`AI replied: ${response.reply}`);
      
      if (audioGuideActive && !response.flagged) {
        speakText(response.reply);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Connection error: ${err.message || 'Unable to contact AI engine.'}`,
        confidence: 0.0,
        intent: 'general',
        tool_calls: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      background: 'rgba(15, 23, 42, 0.85)'
    }}>
      {/* Header */}
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
            Operational Mode: <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{(user?.role || 'spectator').toUpperCase()}</span>
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

      {/* Messages Canvas */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {messages.map((m, idx) => (
          <MessageItem key={idx} message={m} speakText={speakText} handleSend={handleSend} />
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Tray */}
      <div style={{
        paddingTop: '14px',
        borderTop: '1px solid var(--border-glass)'
      }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} style={{
          display: 'flex',
          gap: '8px'
        }}>
          <input
            type="text"
            className="form-input"
            placeholder="Ask something (e.g. 'Where is Gate D?', 'Evacuation steps')..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            aria-label="Assistant question input query"
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '12px' }} disabled={loading} aria-label="Send message query">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
