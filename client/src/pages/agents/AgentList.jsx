import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { getAgents, deleteAgent } from '../../services/agentService';
import { useAuth } from '../../hooks/useAuth';
import AgentCard from '../../components/agents/AgentCard';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';

const AgentList = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch agents
  const {
    data: agentsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['agents'],
    queryFn: getAgents,
  });

  // Filter agents based on search term
  const filteredAgents = agentsData?.data.filter((agent) => {
    return (
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle agent deletion
  const handleDeleteClick = (agent) => {
    setAgentToDelete(agent);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteAgent(agentToDelete._id);
      setIsDeleteModalOpen(false);
      setAgentToDelete(null);
      refetch(); // Refresh the agents list
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setAgentToDelete(null);
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
        Error loading agents. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-0">
          AI Agents
        </h1>
        <Link
          to="/agents/create"
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Create New Agent
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
          placeholder="Search agents by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Agents Grid */}
      {filteredAgents?.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No agents found.</p>
          <Link
            to="/agents/create"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Create Your First Agent
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents?.map((agent) => (
            <AgentCard
              key={agent._id}
              agent={agent}
              isOwner={agent.creator === user?.id}
              onDelete={() => handleDeleteClick(agent)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Agent"
        message={`Are you sure you want to delete the agent "${agentToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default AgentList;
