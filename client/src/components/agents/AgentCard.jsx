import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { createConversation } from '../../services/conversationService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const AgentCard = ({ agent, isOwner, onDelete }) => {
  const navigate = useNavigate();
  const [isStartingChat, setIsStartingChat] = useState(false);

  // Start a new conversation with this agent
  const handleStartChat = async () => {
    try {
      setIsStartingChat(true);
      const response = await createConversation(agent._id, 'Hello');
      navigate(`/conversations/${response.data.conversation.id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      setIsStartingChat(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 mr-3">
              {agent.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">{agent.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{agent.model}</p>
            </div>
          </div>
          {agent.isPublic && (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
              Public
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {agent.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {agent.enableWebSearch && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
              Web Search
            </span>
          )}
          {agent.enableFollowupQuestions && (
            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full">
              Follow-up Questions
            </span>
          )}
          {agent.knowledgeBases?.length > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 rounded-full">
              Knowledge Base
            </span>
          )}
          {agent.allowNSFW && (
            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full">
              NSFW
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {isOwner && (
              <>
                <Link
                  to={`/agents/${agent._id}/edit`}
                  className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  title="Edit Agent"
                >
                  <FiEdit2 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => onDelete(agent)}
                  className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                  title="Delete Agent"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          <button
            onClick={handleStartChat}
            disabled={isStartingChat}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiMessageSquare className="w-4 h-4 mr-1" />
            {isStartingChat ? 'Starting...' : 'Chat'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
