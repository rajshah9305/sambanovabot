# SambaNova AI Chatbot

A full-stack chatbot application using SambaNova's AI platform with Llama 4 Maverick.

## Features

- Real-time chat interface using WebSockets
- Integration with SambaNova AI API
- Message history persistence with MongoDB
- Responsive UI built with React/Next.js and TailwindCSS

## Project Structure

```
sambanova-chatbot/
├── frontend/  # Next.js application
├── backend/   # Express server with Socket.io
```

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB
- SambaNova API key

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=3001
   MONGO_URI=mongodb://localhost:27017/sambanova-chatbot
   SAMBANOVA_API_KEY=your_api_key_here
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with:
   ```
   BACKEND_URL=http://localhost:3001
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Backend Deployment

The backend can be deployed to any Node.js hosting service like Heroku, AWS, or DigitalOcean.

### Frontend Deployment

The frontend can be deployed to Vercel:

```
cd frontend
vercel
```

## License

MIT