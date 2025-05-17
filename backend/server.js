const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const connectDB = require('./config/db');
const Message = require('./models/Message');
require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Socket.io setup with MongoDB and SambaNova API integration
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Send chat history to new client
  const sendChatHistory = async () => {
    try {
      const messages = await Message.find().sort({ timestamp: 1 }).limit(50);
      socket.emit('chat-history', messages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };
  
  sendChatHistory();
  
  socket.on('message', async (msg) => {
    try {
      console.log('Received message:', msg);
      
      // Save user message to DB
      const userMessage = new Message({ 
        user: 'user', 
        message: msg 
      });
      await userMessage.save();
      
      // Broadcast user message to all clients
      io.emit('message', {
        user: 'user',
        message: msg,
        timestamp: new Date()
      });
      
      // Call SambaNova API
      const response = await axios.post(
        'https://api.sambanova.ai/chat',
        { message: msg },
        {
          headers: {
            'Authorization': `Bearer ${process.env.SAMBANOVA_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const botMessage = response.data.message;
      
      // Save bot response to DB
      const botResponse = new Message({
        user: 'bot',
        message: botMessage
      });
      await botResponse.save();
      
      // Broadcast bot response to all clients
      io.emit('message', {
        user: 'bot',
        message: botMessage,
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Send error message to client
      socket.emit('error', {
        message: 'Failed to process your message. Please try again.'
      });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});