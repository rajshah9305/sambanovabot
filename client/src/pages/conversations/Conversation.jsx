import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiSend, FiEdit2, FiArrowLeft, FiTrash2, FiLoader } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { getConversationById, sendMessage, updateConversationTitle, deleteConversation } from '../../services/conversationService';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import FollowupSuggestions from '../../components/conversations/FollowupSuggestions';
import WebSearchResults from '../../components/conversations/WebSearchResults';
import KnowledgeBaseReferences from '../../components/conversations/KnowledgeBaseReferences';
import MessageBubble from '../../components/conversations/MessageBubble';
import TypingIndicator from '../../components/conversations/TypingIndicator';

const Conversation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const [newMessage, setNewMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFollowup, setSelectedFollowup] = useState(null);

  // Fetch conversation data
  const {
    data: conversationData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['conversation', id],
    queryFn: () => getConversationById(id),
    refetchInterval: 0, // Don't auto-refresh
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ conversationId, message }) => sendMessage(conversationId, message),
    onSuccess: () => {
      queryClient.invalidateQueries(['conversation', id]);
      setNewMessage('');
      setSelectedFollowup(null);
    },
  });

  // Update title mutation
  const updateTitleMutation = useMutation({
    mutationFn: ({ conversationId, title }) => updateConversationTitle(conversationId, title),
    onSuccess: () => {
      queryClient.invalidateQueries(['conversation', id]);
      queryClient.invalidateQueries(['conversations']);
      setIsEditing(false);
    },
  });

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: (conversationId) => deleteConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations']);
      navigate('/conversations');
    },
  });

  // Set title when conversation data is loaded
  useEffect(() => {
    if (conversationData) {
      setTitle(conversationData.data.title || 'New Conversation');
    }
  }, [conversationData]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationData?.data.messages]);

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessageMutation.mutate({ conversationId: id, message: newMessage });
    }
  };

  // Handle selecting a follow-up question
  const handleFollowupClick = (question) => {
    setNewMessage(question);
    setSelectedFollowup(question);
  };

  // Handle title update
  const handleTitleUpdate = () => {
    if (title.trim()) {
      updateTitleMutation.mutate({ conversationId: id, title });
    }
  };

  // Handle conversation deletion
  const handleDeleteConfirm = () => {
    deleteConversationMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-md">
        Error loading conversation. Please try refreshing the page.
      </div>
    );
  }

  const conversation = conversationData.data;
  const messages = conversation.messages || [];
  const agent = conversation.agent || {};
  const lastMessage = messages[messages.length - 1];
  const isAiResponding = sendMessageMutation.isLoading;

  // Get the last AI message with metadata
  const lastAiMessageWithMetadata = [...messages]
    .reverse()
    .find(msg => msg.role === 'assistant' && msg.metadata);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/conversations')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          {isEditing ? (
            <div className="flex items-center">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-3 py-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                autoFocus
                onBlur={handleTitleUpdate}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleUpdate()}
              />
              <button
                onClick={handleTitleUpdate}
                className="ml-2 text-primary-600 dark:text-primary-400"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white mr-2">
                {title}
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Agent Info */}
      <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 mr-3">
            {agent.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <p className="font-medium text-gray-800 dark:text-white">{agent.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{agent.model}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          // Skip system messages that aren't meant to be displayed
          if (message.role === 'system' && !message.content.includes('Web search results') && !message.content.includes('knowledge base')) {
            return null;
          }
          
          return (
            <MessageBubble
              key={index}
              message={message}
              isLastMessage={index === messages.length - 1}
            />
          );
        })}
        
        {isAiResponding && (
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 mr-3">
              {agent.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
              <TypingIndicator />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Follow-up Suggestions */}
      {agent.enableFollowupQuestions && lastAiMessageWithMetadata?.metadata?.followupQuestions?.length > 0 && !isAiResponding && (
        <FollowupSuggestions
          suggestions={lastAiMessageWithMetadata.metadata.followupQuestions}
          onSuggestionClick={handleFollowupClick}
          selectedSuggestion={selectedFollowup}
        />
      )}

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            disabled={isAiResponding}
          />
          <button
            type="submit"
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newMessage.trim() || isAiResponding}
          >
            {isAiResponding ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiSend className="w-5 h-5" />}
          </button>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Conversation;
