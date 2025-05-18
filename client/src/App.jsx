import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Main Pages
import Dashboard from './pages/Dashboard';
import AgentList from './pages/agents/AgentList';
import AgentCreate from './pages/agents/AgentCreate';
import AgentEdit from './pages/agents/AgentEdit';
import AgentDetail from './pages/agents/AgentDetail';
import ConversationList from './pages/conversations/ConversationList';
import Conversation from './pages/conversations/Conversation';
import KnowledgeBaseList from './pages/knowledge/KnowledgeBaseList';
import KnowledgeBaseCreate from './pages/knowledge/KnowledgeBaseCreate';
import KnowledgeBaseEdit from './pages/knowledge/KnowledgeBaseEdit';
import KnowledgeBaseDetail from './pages/knowledge/KnowledgeBaseDetail';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          
          {/* Agent Routes */}
          <Route path="/agents" element={<AgentList />} />
          <Route path="/agents/create" element={<AgentCreate />} />
          <Route path="/agents/:id" element={<AgentDetail />} />
          <Route path="/agents/:id/edit" element={<AgentEdit />} />
          
          {/* Conversation Routes */}
          <Route path="/conversations" element={<ConversationList />} />
          <Route path="/conversations/:id" element={<Conversation />} />
          
          {/* Knowledge Base Routes */}
          <Route path="/knowledge-bases" element={<KnowledgeBaseList />} />
          <Route path="/knowledge-bases/create" element={<KnowledgeBaseCreate />} />
          <Route path="/knowledge-bases/:id" element={<KnowledgeBaseDetail />} />
          <Route path="/knowledge-bases/:id/edit" element={<KnowledgeBaseEdit />} />
          
          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
