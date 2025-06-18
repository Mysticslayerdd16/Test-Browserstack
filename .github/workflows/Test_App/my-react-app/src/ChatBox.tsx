import React, { useState, useRef, useEffect } from 'react';
import nlp from 'compromise';

const ASSISTANT_ID = import.meta.env.VITE_ASSISTANT_ID;

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatBoxProps = {
  onCityChange?: (city: string) => void;
};

const extractCityFromText = (text: string): string | null => {
  const doc = nlp(text);
  const places = doc.places().out('array');
  if (places.length > 0) {
    return places[0]; // Return the first detected place
  }
  // Fallback: try to extract after "about", "in", etc.
  const match = text.match(/(?:about|in|for|of|at)\s+([a-zA-Z\s]+)/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  // Fallback: return the whole text
  return text.trim();
};

const ChatBox: React.FC<ChatBoxProps> = ({ onCityChange }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [threadId, setThreadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewChat = () => {
    setMessages([]);
    setThreadId(null);
    if (onCityChange) onCityChange('Gurugram');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((msgs) => [...msgs, { role: 'user', content: input }]);
    setLoading(true);

    const city = extractCityFromText(input);
    if (city && onCityChange) {
      onCityChange(city);
    }

    const body = {
      thread_id: threadId,
      message: input,
      assistant_id: ASSISTANT_ID,
    };

    setInput('');
    let assistantMsg = '';
    setMessages((msgs) => [...msgs, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          assistantMsg += chunk;
          setMessages((msgs) => {
            const updated = [...msgs];
            updated[updated.length - 1] = { role: 'assistant', content: assistantMsg };
            return updated;
          });
        }
      }
    } catch (err) {
      setMessages((msgs) => {
        const updated = [...msgs];
        updated[updated.length - 1] = { role: 'assistant', content: '[Error streaming response]' };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

  return (
    <div
      className="flex-1 bg-white bg-opacity-80 p-3 flex flex-col rounded-xl shadow-md m-1"
      style={{
        minWidth: 0,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        fontSize: '0.95rem',
      }}
    >
      <h2 className="text-lg font-bold mb-2 text-yellow-600 flex items-center gap-2">
        <span role="img" aria-label="chat">💬</span> City Chat Corner
      </h2>
      <div
        ref={chatRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: 8,
          padding: 6,
          background: '#f9f9f9',
          borderRadius: 8,
          border: '1px solid #eee',
          minHeight: 120,
          maxHeight: 180,
          wordBreak: 'break-word',
          fontSize: '0.95rem',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              margin: '6px 0',
              color: msg.role === 'assistant' ? '#0077cc' : '#222',
              textAlign: msg.role === 'assistant' ? 'left' : 'right',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            <b>{msg.role === 'assistant' ? 'Assistant' : 'You'}:</b> {msg.content}
          </div>
        ))}
        {loading && <div style={{ color: '#888' }}>Assistant is typing...</div>}
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          gap: 6,
          alignItems: 'center',
        }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          style={{
            flex: 1,
            minWidth: 0, // Ensures the input can shrink properly in flex layouts
            padding: 8,
            borderRadius: 8,
            border: '1px solid #ccc',
            fontSize: '0.95rem',
            outline: 'none',
            background: '#fffbe6',
          }}
          placeholder="Type a city or chat..."
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: 'none',
            background: '#fbbf24',
            color: '#fff',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            fontSize: '0.95rem',
          }}
        >
          Send
        </button>
        <button
          type="button"
          onClick={handleNewChat}
          disabled={loading}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: 'none',
            background: '#f3f4f6',
            color: '#333',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            fontSize: '0.95rem',
          }}
        >
          New Chat
        </button>
      </form>
    </div>
  );
};

export default ChatBox;