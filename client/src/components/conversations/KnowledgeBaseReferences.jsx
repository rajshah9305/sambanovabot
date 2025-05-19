import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiDatabase, FiBook, FiFileText } from 'react-icons/fi';

const KnowledgeBaseReferences = ({ documents }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!documents || documents.length === 0) {
    return null;
  }

  // Show only first 2 documents when collapsed
  const displayDocuments = isExpanded ? documents : documents.slice(0, 2);

  return (
    <div>
      <div
        className="flex items-center justify-between cursor-pointer mb-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 mr-2">
            <FiBook className="w-3 h-3" />
          </div>
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Knowledge Base References
          </h4>
        </div>
        <button className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors duration-200">
          {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className="space-y-3">
        {displayDocuments.map((doc, index) => (
          <div
            key={index}
            className="text-xs bg-white dark:bg-neutral-800 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start">
              <FiFileText className="w-3.5 h-3.5 text-secondary-500 dark:text-secondary-400 mt-0.5 mr-1.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-secondary-600 dark:text-secondary-400">
                  {doc.title || `Document ${index + 1}`}
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1.5 line-clamp-3">
                  {doc.content || 'No content preview available'}
                </p>
                {doc.knowledgeBase && (
                  <div className="flex items-center mt-1.5 text-neutral-500 dark:text-neutral-500">
                    <FiDatabase className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{doc.knowledgeBase.name || 'Unknown knowledge base'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {documents.length > 2 && !isExpanded && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
          }}
          className="mt-3 px-3 py-1.5 text-xs font-medium text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-900/20 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 rounded-full transition-colors duration-200 inline-flex items-center"
        >
          <FiChevronDown className="w-3 h-3 mr-1" />
          Show {documents.length - 2} more references
        </button>
      )}
    </div>
  );
};

export default KnowledgeBaseReferences;
