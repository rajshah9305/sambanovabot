import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiPlus, FiMessageSquare, FiUsers, FiDatabase } from 'react-icons/fi';
import { getAgents } from '../services/agentService';
import { getConversations } from '../services/conversationService';
import { getKnowledgeBases } from '../services/knowledgeBaseService';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    agents: 0,
    conversations: 0,
    knowledgeBases: 0,
  });

  // Fetch agents
  const {
    data: agentsData,
    isLoading: agentsLoading,
    error: agentsError,
  } = useQuery({
    queryKey: ['agents'],
    queryFn: getAgents,
  });

  // Fetch conversations
  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    error: conversationsError,
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });

  // Fetch knowledge bases
  const {
    data: knowledgeBasesData,
    isLoading: knowledgeBasesLoading,
    error: knowledgeBasesError,
  } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: getKnowledgeBases,
  });

  // Update stats when data is loaded
  useEffect(() => {
    const newStats = { ...stats };

    if (agentsData) {
      newStats.agents = agentsData.data.length;
    }

    if (conversationsData) {
      newStats.conversations = conversationsData.data.length;
    }

    if (knowledgeBasesData) {
      newStats.knowledgeBases = knowledgeBasesData.data.length;
    }

    setStats(newStats);
  }, [agentsData, conversationsData, knowledgeBasesData]);

  // Filter user's agents
  const userAgents = agentsData?.data.filter(
    (agent) => agent.creator === user?.id || agent.isPublic
  ).slice(0, 4) || [];

  // Get recent conversations
  const recentConversations = conversationsData?.data.slice(0, 5) || [];

  const isLoading = agentsLoading || conversationsLoading || knowledgeBasesLoading;
  const hasError = agentsError || conversationsError || knowledgeBasesError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-md">
        Error loading dashboard data. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Welcome, {user?.name}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
              <FiUsers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Agents</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats.agents}</p>
            </div>
          </div>
          <Link
            to="/agents"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block"
          >
            View all agents
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mr-4">
              <FiMessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversations</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                {stats.conversations}
              </p>
            </div>
          </div>
          <Link
            to="/conversations"
            className="text-sm text-green-600 dark:text-green-400 hover:underline mt-4 inline-block"
          >
            View all conversations
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mr-4">
              <FiDatabase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Knowledge Bases</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                {stats.knowledgeBases}
              </p>
            </div>
          </div>
          <Link
            to="/knowledge-bases"
            className="text-sm text-purple-600 dark:text-purple-400 hover:underline mt-4 inline-block"
          >
            View all knowledge bases
          </Link>
        </div>
      </div>

      {/* Your Agents */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Your Agents</h2>
          <Link
            to="/agents/create"
            className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FiPlus className="w-4 h-4 mr-1" />
            Create New Agent
          </Link>
        </div>

        {userAgents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">You don't have any agents yet.</p>
            <Link
              to="/agents/create"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Your First Agent
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {userAgents.map((agent) => (
              <Link
                key={agent._id}
                to={`/agents/${agent._id}`}
                className="block bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                    {agent.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">{agent.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{agent.model}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {agent.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Conversations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Recent Conversations
          </h2>
          <Link
            to="/conversations"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All
          </Link>
        </div>

        {recentConversations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No conversations yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentConversations.map((conversation) => (
              <Link
                key={conversation._id}
                to={`/conversations/${conversation._id}`}
                className="block py-4 hover:bg-gray-50 dark:hover:bg-gray-700 -mx-6 px-6 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      {conversation.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Agent: {conversation.agent?.name || 'Unknown'}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
