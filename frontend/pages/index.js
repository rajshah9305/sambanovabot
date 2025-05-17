import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';

// Initialize socket connection
let socket;

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
    socket = io(BACKEND_URL);

    // Socket event handlers
    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    socket.on('chat-history', (history) => {
      setMessages(history);
    });

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      // Display error to user
      setMessages((prevMessages) => [
        ...prevMessages, 
        { 
          user: 'bot', 
          message: 'Sorry, there was an error processing your request.', 
          timestamp: new Date() 
        }
      ]);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (message) => {
    if (connected) {
      socket.emit('message', message);
    } else {
      console.error('Not connected to server');
      // Display error to user
      setMessages((prevMessages) => [
        ...prevMessages, 
        { 
          user: 'bot', 
          message: 'Not connected to server. Please try again later.', 
          timestamp: new Date() 
        }
      ]);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="chat-container">
        <h1 className="text-2xl font-bold mb-4 text-center">
          SambaNova AI Chatbot
        </h1>
        <ChatWindow messages={messages} />
        <MessageInput onSendMessage={sendMessage} />
        <div className="text-center mt-4 text-sm text-gray-500">
          {connected ? 
            'Connected to SambaNova AI' : 
            'Connecting to SambaNova AI...'}
        </div>
      </div>
    </div>
  );
}