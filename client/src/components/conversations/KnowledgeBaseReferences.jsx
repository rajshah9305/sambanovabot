import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiDatabase } from 'react-icons/fi';

const KnowledgeBaseReferences = ({ documents }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!documents || documents.length === 0) {
    return null;
  }

  // Show only first 2 documents when collapsed
  const displayDocuments = isExpanded ? documents : documents.slice(0, 2);

  return (
    <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
      <div 
        className="flex items-center justify-between cursor-pointer mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <FiDatabase className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Knowledge Base References
          </h4>
        </div>
        <button className="text-gray-500 dark:text-gray-400">
          {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="space-y-2">
        {displayDocuments.map((doc, index) => (
          <div key={index} className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <div className="font-medium text-purple-600 dark:text-purple-400">
              {doc.title || `Document ${index + 1}`}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-3">
              {doc.content || 'No content preview available'}
            </p>
            {doc.knowledgeBase && (
              <p className="text-gray-500 dark:text-gray-500 mt-1">
                Source: {doc.knowledgeBase.name || 'Unknown knowledge base'}
              </p>
            )}
          </div>
        ))}
      </div>
      
      {documents.length > 2 && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="text-xs text-purple-600 dark:text-purple-400 hover:underline mt-2"
        >
          Show {documents.length - 2} more references
        </button>
      )}
    </div>
  );
};

export default KnowledgeBaseReferences;
