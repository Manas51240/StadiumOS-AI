import React from 'react';
import { Volume2, AlertTriangle, Wrench, ShieldCheck, Cpu } from 'lucide-react';
import DOMPurify from 'dompurify';

export interface ToolCall {
  function_name: string;
  arguments: Record<string, any>;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  confidence?: number;
  flagged?: boolean;
  flag_reason?: string;
  suggested_actions?: string[];
  intent?: string;
  tool_calls?: ToolCall[];
}

interface MessageItemProps {
  message: Message;
  speakText: (text: string) => void;
  handleSend: (text: string) => void;
}

export default function MessageItem({ message, speakText, handleSend }: MessageItemProps) {
  const isUser = message.role === 'user';
  
  // Sanitize the HTML content of the message to protect against XSS
  const sanitizedContent = typeof window !== 'undefined'
    ? DOMPurify.sanitize(message.content)
    : message.content;

  return (
    <div style={{
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
        {/* Render sanitized HTML safely */}
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        
        {/* Visual Tool Calls Log inside bubble */}
        {!isUser && message.tool_calls && message.tool_calls.length > 0 && (
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
            {message.tool_calls.map((t, tIdx) => (
              <div key={tIdx} style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}>
                {t.function_name}({JSON.stringify(t.arguments)})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meta Indicators under bubble */}
      {!isUser && (
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          marginTop: '4px',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          paddingLeft: '4px'
        }}>
          {message.confidence !== undefined && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Cpu size={12} />
              Confidence: {Math.round(message.confidence * 100)}%
            </span>
          )}
          
          {message.intent && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} color="var(--color-primary)" />
              Intent: {message.intent.toUpperCase()}
            </span>
          )}

          <button
            onClick={() => speakText(message.content)}
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
      )}

      {/* Guardrails flagging warnings */}
      {!isUser && message.flagged && (
        <div style={{
          marginTop: '6px',
          padding: '6px 12px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid var(--color-danger)',
          borderRadius: '6px',
          fontSize: '0.78rem',
          color: 'var(--color-danger)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <AlertTriangle size={14} />
          <span>Prompt blocked by safety filter: {message.flag_reason}</span>
        </div>
      )}

      {/* Suggested action tags */}
      {!isUser && message.suggested_actions && message.suggested_actions.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '8px',
          flexWrap: 'wrap'
        }}>
          {message.suggested_actions.map((act, actIdx) => (
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
      )}
    </div>
  );
}
