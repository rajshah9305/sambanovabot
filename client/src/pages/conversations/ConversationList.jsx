import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiSearch, FiMessageSquare, FiTrash2, FiPlus } from 'react-icons/fi';
import { getConversations, deleteConversation } from '../../services/conversationService';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';

const ConversationList = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch conversations
  const {
    data: conversationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: (conversationId) => deleteConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations']);
    },
  });

  // Filter conversations based on search term
  const filteredConversations = conversationsData?.data.filter((conversation) => {
    return (
      conversation.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.agent?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle conversation deletion
  const handleDeleteClick = (conversation) => {
    setConversationToDelete(conversation);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteConversationMutation.mutate(conversationToDelete._id);
    setIsDeleteModalOpen(false);
    setConversationToDelete(null);
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
        Error loading conversations. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-0">
          Conversations
        </h1>
        <Link
          to="/agents"
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Start New Conversation
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FiSearch className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-3 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Conversations List */}
      {filteredConversations?.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <FiMessageSquare className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">No conversations found.</p>
          <Link
            to="/agents"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Start Your First Conversation
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredConversations?.map((conversation) => (
              <div
                key={conversation._id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Link
                  to={`/conversations/${conversation._id}`}
                  className="flex-1 flex items-center"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 mr-4">
                    {conversation.agent?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      {conversation.title || 'New Conversation'}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>{conversation.agent?.name || 'Unknown Agent'}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(conversation.updatedAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteClick(conversation);
                  }}
                  className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Conversation"
        message={`Are you sure you want to delete the conversation "${
          conversationToDelete?.title || 'New Conversation'
        }"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ConversationList;
