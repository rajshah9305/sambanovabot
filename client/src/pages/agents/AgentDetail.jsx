import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';

const AgentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/agents/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch agent details');
        }
        
        const data = await response.json();
        setAgent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/agents/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete agent');
      }

      navigate('/agents');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-700">Agent not found</h2>
        <Link to="/agents" className="mt-4 inline-flex items-center text-primary-600 hover:underline">
          <FiArrowLeft className="mr-1" /> Back to Agents
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link to="/agents" className="flex items-center text-primary-600 hover:underline">
          <FiArrowLeft className="mr-1" /> Back to Agents
        </Link>
        <div className="flex space-x-2">
          <Link
            to={`/agents/${id}/edit`}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <FiEdit className="mr-1" /> Edit
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <FiTrash2 className="mr-1" /> Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{agent.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Agent Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Description:</span> {agent.description || 'No description provided'}</p>
              <p><span className="font-medium">Model:</span> {agent.model}</p>
              <p><span className="font-medium">Created:</span> {new Date(agent.createdAt).toLocaleString()}</p>
              <p><span className="font-medium">Last Updated:</span> {new Date(agent.updatedAt).toLocaleString()}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Configuration</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Web Search:</span> {agent.webSearchEnabled ? 'Enabled' : 'Disabled'}</p>
              <p><span className="font-medium">Memory:</span> {agent.memoryEnabled ? 'Enabled' : 'Disabled'}</p>
              <p><span className="font-medium">Follow-up Questions:</span> {agent.followupEnabled ? 'Enabled' : 'Disabled'}</p>
              <p><span className="font-medium">NSFW Content:</span> {agent.nsfwEnabled ? 'Allowed' : 'Blocked'}</p>
            </div>
          </div>
        </div>

        {agent.instructions && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Instructions</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="whitespace-pre-wrap">{agent.instructions}</pre>
            </div>
          </div>
        )}

        {agent.knowledgeBases && agent.knowledgeBases.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Knowledge Bases</h2>
            <ul className="list-disc list-inside space-y-1 ml-2">
              {agent.knowledgeBases.map(kb => (
                <li key={kb._id}>
                  <Link to={`/knowledge-bases/${kb._id}`} className="text-primary-600 hover:underline">
                    {kb.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          title="Delete Agent"
          message={`Are you sure you want to delete the agent "${agent.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default AgentDetail;
