import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiArrowLeft, FiUpload, FiFile } from 'react-icons/fi';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';

const KnowledgeBaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [knowledgeBase, setKnowledgeBase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchKnowledgeBase = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/knowledge-bases/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch knowledge base details');
        }
        
        const data = await response.json();
        setKnowledgeBase(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgeBase();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/knowledge-bases/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete knowledge base');
      }

      navigate('/knowledge-bases');
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

  if (!knowledgeBase) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-700">Knowledge base not found</h2>
        <Link to="/knowledge-bases" className="mt-4 inline-flex items-center text-primary-600 hover:underline">
          <FiArrowLeft className="mr-1" /> Back to Knowledge Bases
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link to="/knowledge-bases" className="flex items-center text-primary-600 hover:underline">
          <FiArrowLeft className="mr-1" /> Back to Knowledge Bases
        </Link>
        <div className="flex space-x-2">
          <Link
            to={`/knowledge-bases/${id}/edit`}
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
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{knowledgeBase.name}</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Details</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Description:</span> {knowledgeBase.description || 'No description provided'}</p>
            <p><span className="font-medium">Created:</span> {new Date(knowledgeBase.createdAt).toLocaleString()}</p>
            <p><span className="font-medium">Last Updated:</span> {new Date(knowledgeBase.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Documents</h2>
          {knowledgeBase.documents && knowledgeBase.documents.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-md">
              <ul className="divide-y divide-gray-200">
                {knowledgeBase.documents.map((doc, index) => (
                  <li key={index} className="py-3 flex items-center">
                    <FiFile className="mr-2 text-gray-500" />
                    <span>{doc.name || `Document ${index + 1}`}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({new Date(doc.uploadedAt).toLocaleDateString()})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 italic">No documents have been added to this knowledge base yet.</p>
          )}
          
          <div className="mt-4">
            <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              <FiUpload className="mr-1" /> Upload Document
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Used by Agents</h2>
          {knowledgeBase.agents && knowledgeBase.agents.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 ml-2">
              {knowledgeBase.agents.map(agent => (
                <li key={agent._id}>
                  <Link to={`/agents/${agent._id}`} className="text-primary-600 hover:underline">
                    {agent.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">This knowledge base is not currently used by any agents.</p>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          title="Delete Knowledge Base"
          message={`Are you sure you want to delete the knowledge base "${knowledgeBase.name}"? This action cannot be undone and will remove all associated documents.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default KnowledgeBaseDetail;
