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
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/conversations')}
            className="mr-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors duration-200"
            aria-label="Back to conversations"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>

          {isEditing ? (
            <div className="flex items-center">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition-all duration-200"
                autoFocus
                onBlur={handleTitleUpdate}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleUpdate()}
              />
              <button
                onClick={handleTitleUpdate}
                className="ml-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white mr-2 truncate max-w-[200px] md:max-w-md">
                {title}
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200"
                aria-label="Edit conversation title"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="p-2 rounded-lg text-neutral-500 hover:text-error-600 hover:bg-error-50 dark:text-neutral-400 dark:hover:text-error-400 dark:hover:bg-error-900/20 transition-colors duration-200"
          aria-label="Delete conversation"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Agent Info */}
      <div className="bg-neutral-50 dark:bg-neutral-800/50 px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-sm mr-3">
            {agent.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <p className="font-medium text-neutral-900 dark:text-white">{agent.name || 'AI Assistant'}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-success-500 mr-1.5"></span>
              {agent.model || 'SambaNova Model'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-3xl mx-auto space-y-6">
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

          {isAiResponding && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Follow-up Suggestions */}
      {agent.enableFollowupQuestions && lastAiMessageWithMetadata?.metadata?.followupQuestions?.length > 0 && !isAiResponding && (
        <div className="border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <FollowupSuggestions
              suggestions={lastAiMessageWithMetadata.metadata.followupQuestions}
              onSuggestionClick={handleFollowupClick}
              selectedSuggestion={selectedFollowup}
            />
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 shadow-md">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 pr-12 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm transition-all duration-200"
                disabled={isAiResponding}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                disabled={!newMessage.trim() || isAiResponding}
              >
                {isAiResponding ? (
                  <FiLoader className="w-5 h-5 animate-spin" />
                ) : (
                  <FiSend className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
          <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 text-center">
            <span className="inline-flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-success-500 mr-1.5"></span>
              Powered by SambaNova AI
            </span>
          </div>
        </div>
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
