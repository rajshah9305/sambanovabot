import { useEffect, useRef } from 'react';

export default function ChatWindow({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div 
          key={index} 
          className={`message ${msg.user === 'user' ? 'user-message' : 'bot-message'}`}
        >
          <div className="text-xs text-gray-500 mb-1">
            {msg.user === 'user' ? 'You' : 'SambaNova AI'}
          </div>
          <div>{msg.message}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}