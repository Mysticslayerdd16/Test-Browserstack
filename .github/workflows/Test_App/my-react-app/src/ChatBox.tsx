import React, { useState, useRef, useEffect } from 'react';

const ASSISTANT_ID = import.meta.env.VITE_ASSISTANT_ID;

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const ChatBox: React.FC = () => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting!'); // <-- Add this line
    if (!input.trim()) return;

    setMessages((msgs) => [...msgs, { role: 'user', content: input }]);
    setLoading(true);

    // Prepare request
    const body = {
      thread_id: threadId,
      message: input,
      assistant_id: ASSISTANT_ID,
    };

    setInput('');
    let assistantMsg = '';
    setMessages((msgs) => [...msgs, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
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

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '40px auto',
        padding: 16,
        border: '1px solid #ddd',
        borderRadius: 8,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 500,
        boxShadow: '0 2px 8px #0001',
      }}
    >
      <div
        ref={chatRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: 16,
          padding: 8,
          background: '#f9f9f9',
          borderRadius: 4,
          border: '1px solid #eee',
          minHeight: 300,
          maxHeight: 350,
          wordBreak: 'break-word',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              margin: '8px 0',
              color: msg.role === 'assistant' ? '#0077cc' : '#222',
              textAlign: msg.role === 'assistant' ? 'left' : 'right',
              whiteSpace: 'pre-wrap',
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
          gap: 8,
          alignItems: 'center',
        }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 4,
            border: '1px solid #ccc',
            fontSize: 16,
            outline: 'none',
          }}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 16px',
            borderRadius: 4,
            border: 'none',
            background: '#0077cc',
            color: '#fff',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          Send
        </button>
        <button
          type="button"
          onClick={handleNewChat}
          disabled={loading}
          style={{
            padding: '10px 16px',
            borderRadius: 4,
            border: 'none',
            background: '#eee',
            color: '#333',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          New Chat
        </button>
      </form>
    </div>
  );
};

export default ChatBox;