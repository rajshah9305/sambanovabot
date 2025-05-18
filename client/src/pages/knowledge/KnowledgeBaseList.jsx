import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiSearch, FiDatabase, FiTrash2, FiEdit2, FiPlus, FiFileText } from 'react-icons/fi';
import { getKnowledgeBases, deleteKnowledgeBase } from '../../services/knowledgeBaseService';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';

const KnowledgeBaseList = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [kbToDelete, setKbToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch knowledge bases
  const {
    data: knowledgeBasesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: getKnowledgeBases,
  });

  // Delete knowledge base mutation
  const deleteKnowledgeBaseMutation = useMutation({
    mutationFn: (knowledgeBaseId) => deleteKnowledgeBase(knowledgeBaseId),
    onSuccess: () => {
      queryClient.invalidateQueries(['knowledgeBases']);
    },
  });

  // Filter knowledge bases based on search term
  const filteredKnowledgeBases = knowledgeBasesData?.data.filter((kb) => {
    return (
      kb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kb.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle knowledge base deletion
  const handleDeleteClick = (kb) => {
    setKbToDelete(kb);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteKnowledgeBaseMutation.mutate(kbToDelete._id);
    setIsDeleteModalOpen(false);
    setKbToDelete(null);
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
        Error loading knowledge bases. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-0">
          Knowledge Bases
        </h1>
        <Link
          to="/knowledge-bases/create"
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Create Knowledge Base
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
          placeholder="Search knowledge bases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Knowledge Bases Grid */}
      {filteredKnowledgeBases?.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <FiDatabase className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">No knowledge bases found.</p>
          <Link
            to="/knowledge-bases/create"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Create Your First Knowledge Base
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKnowledgeBases?.map((kb) => (
            <div
              key={kb._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 mr-3">
                      <FiDatabase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">{kb.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {kb.documents?.length || 0} documents
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {kb.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Link
                      to={`/knowledge-bases/${kb._id}/edit`}
                      className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                      title="Edit Knowledge Base"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(kb)}
                      className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      title="Delete Knowledge Base"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <Link
                    to={`/knowledge-bases/${kb._id}`}
                    className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <FiFileText className="w-4 h-4 mr-1" />
                    View Documents
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Knowledge Base"
        message={`Are you sure you want to delete the knowledge base "${kbToDelete?.name}"? This will also delete all documents within it. This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default KnowledgeBaseList;
