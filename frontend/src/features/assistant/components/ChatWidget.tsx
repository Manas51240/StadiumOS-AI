'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../core/context/AuthContext';
import { useAccessibility } from '../../../core/context/AccessibilityContext';
import { Send, AlertTriangle, ShieldCheck, Volume2, Cpu, Wrench } from 'lucide-react';

interface ToolCall {
  function_name: string;
  arguments: Record<string, any>;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  confidence?: number;
  flagged?: boolean;
  flag_reason?: string;
  suggested_actions?: string[];
  intent?: string;
  tool_calls?: ToolCall[];
}

export default function ChatWidget() {
  const { apiFetch, user } = useAuth();
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
      const response = await apiFetch('/api/v1/assistant/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: messageText,
          language: language,
          conversation_id: 'active-session-wc-2026'
        })
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
        
        {/* Language selector */}
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
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isUser ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              alignSelf: isUser ? 'flex-end' : 'flex-start'
            }}>
              
              {/* Message content box */}
              <div style={{
                background: isUser ? 'var(--color-secondary)' : 'var(--bg-secondary)',
                color: isUser ? '#ffffff' : 'var(--text-primary)',
                padding: '12px 16px',
                borderRadius: '12px',
                borderTopRightRadius: isUser ? '2px' : '12px',
                borderTopLeftRadius: isUser ? '12px' : '2px',
                fontSize: '0.95rem',
                border: isUser ? 'none' : '1px solid var(--border-glass)',
                position: 'relative'
              }}>
                {m.content}
                
                {/* Visual Tool Calls Log inside bubble */}
                {!isUser && m.tool_calls && m.tool_calls.length > 0 && (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    marginTop: '8px',
                    fontSize: '0.78rem',
                    fontFamily: 'monospace',
                    color: '#34d399',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                      <Wrench size={12} />
                      <span>Operations Tool Executed:</span>
                    </div>
                    {m.tool_calls.map((t, tIdx) => (
                      <div key={tIdx} style={{ paddingLeft: '8px', borderLeft: '1px solid rgba(52, 211, 153, 0.3)' }}>
                        <strong>{t.function_name}</strong>({JSON.stringify(t.arguments)})
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Speech read button for AI answers */}
                {!isUser && m.confidence !== undefined && (
                  <button
                    onClick={() => speakText(m.content)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      position: 'absolute',
                      right: '6px',
                      bottom: '-22px'
                    }}
                    title="Speak answer"
                    aria-label="Speak text aloud"
                  >
                    <Volume2 size={12} />
                  </button>
                )}
              </div>

              {/* Anomaly / Injection Check Warning */}
              {m.flagged && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid var(--color-danger)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  marginTop: '8px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--color-danger)'
                }}>
                  <AlertTriangle size={14} />
                  <span>Security Block: {m.flag_reason}</span>
                </div>
              )}

              {/* Intent Classifier & Confidence scores display */}
              {!isUser && (m.confidence !== undefined || m.intent) && (
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  paddingLeft: '4px'
                }}>
                  {m.confidence !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <ShieldCheck size={12} color={m.confidence > 0.8 ? 'var(--color-primary)' : 'var(--color-accent)'} />
                      <span>Confidence: {Math.round(m.confidence * 100)}%</span>
                    </div>
                  )}
                  {m.intent && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Cpu size={12} color="var(--color-secondary)" />
                      <span>Intent: {m.intent.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Suggested actions inside chat bubbles */}
              {!isUser && m.suggested_actions && m.suggested_actions.length > 0 && (
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginTop: '10px'
                }}>
                  {m.suggested_actions.map((act, aIdx) => (
                    <button
                      key={aIdx}
                      className="btn btn-secondary"
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        borderRadius: '20px'
                      }}
                      onClick={() => handleSend(act)}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              )}

            </div>
          );
        })}
        {loading && (
          <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            AI is analyzing input...
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input control form */}
      <form onSubmit={e => {
        e.preventDefault();
        handleSend(input);
      }} style={{
        display: 'flex',
        gap: '10px',
        paddingTop: '14px',
        borderTop: '1px solid var(--border-glass)'
      }}>
        <input
          type="text"
          className="form-input"
          placeholder="Ask something (e.g. 'Where is Gate D?', 'Evacuation steps')..."
          value={input}
          onChange={e => setInput(e.target.value)}
          aria-label="User assistant chat input"
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ padding: '0 20px' }}
          disabled={loading}
          aria-label="Send Message"
        >
          <Send size={16} />
        </button>
      </form>
      
    </div>
  );
}
