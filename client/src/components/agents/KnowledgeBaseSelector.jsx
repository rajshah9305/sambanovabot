import { useState } from 'react';
import { FiDatabase, FiCheck, FiSearch } from 'react-icons/fi';

const KnowledgeBaseSelector = ({ knowledgeBases, selectedIds, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter knowledge bases based on search term
  const filteredKnowledgeBases = knowledgeBases.filter(
    (kb) =>
      kb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kb.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle selection of a knowledge base
  const toggleSelection = (id) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    
    onChange(newSelection);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
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

      <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
        {filteredKnowledgeBases.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {knowledgeBases.length === 0
              ? 'No knowledge bases available'
              : 'No knowledge bases match your search'}
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            {filteredKnowledgeBases.map((kb) => (
              <div
                key={kb._id}
                className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  selectedIds.includes(kb._id)
                    ? 'bg-primary-50 dark:bg-primary-900/20'
                    : 'bg-white dark:bg-gray-800'
                }`}
                onClick={() => toggleSelection(kb._id)}
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-md border ${
                    selectedIds.includes(kb._id)
                      ? 'bg-primary-500 border-primary-500 text-white'
                      : 'border-gray-300 dark:border-gray-600'
                  } flex items-center justify-center mr-3`}
                >
                  {selectedIds.includes(kb._id) && <FiCheck className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <div className="p-1 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mr-2">
                      <FiDatabase className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {kb.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                    {kb.description}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {kb.documentCount || 0} documents
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {selectedIds.length} knowledge base{selectedIds.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseSelector;
