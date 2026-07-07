import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  loading: boolean;
  handleSend: (text: string) => void;
}

export default function ChatInput({ input, setInput, loading, handleSend }: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div style={{
      paddingTop: '14px',
      borderTop: '1px solid var(--border-glass)'
    }}>
      <form onSubmit={handleSubmit} style={{
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
  );
}
