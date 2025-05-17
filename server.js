// Socket.io setup with MongoDB and SambaNova API integration
io.on('connection', (socket) => {
  socket.on('message', async (msg) => {
    // Call SambaNova API
    const response = await axios.post('https://api.sambanova.ai/chat', { message: msg });
    
    // Store in MongoDB
    const newMessage = new Message({ user: 'user', message: msg });
    await newMessage.save();
    
    // Emit response
    io.emit('message', response.data.message);
  });
});