import React from 'react';
import { AlertTriangle, Wrench } from 'lucide-react';
import DOMPurify from 'dompurify';
import SuggestedActions from './SuggestedActions';
import MessageMeta from './MessageMeta';

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
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        
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

      {!isUser && (
        <MessageMeta
          confidence={message.confidence}
          intent={message.intent}
          content={message.content}
          speakText={speakText}
        />
      )}

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

      {!isUser && message.suggested_actions && (
        <SuggestedActions actions={message.suggested_actions} handleSend={handleSend} />
      )}
    </div>
  );
}
