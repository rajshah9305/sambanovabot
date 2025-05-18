import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiExternalLink, FiSearch } from 'react-icons/fi';

const WebSearchResults = ({ results }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!results || results.length === 0) {
    return null;
  }

  // Show only first 3 results when collapsed
  const displayResults = isExpanded ? results : results.slice(0, 3);

  return (
    <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
      <div 
        className="flex items-center justify-between cursor-pointer mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <FiSearch className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Web Search Results
          </h4>
        </div>
        <button className="text-gray-500 dark:text-gray-400">
          {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="space-y-2">
        {displayResults.map((result, index) => (
          <div key={index} className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <a 
              href={result.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              {result.title}
              <FiExternalLink className="ml-1 w-3 h-3" />
            </a>
            <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {result.snippet}
            </p>
            <p className="text-gray-500 dark:text-gray-500 mt-1 truncate">
              {result.link}
            </p>
          </div>
        ))}
      </div>
      
      {results.length > 3 && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2"
        >
          Show {results.length - 3} more results
        </button>
      )}
    </div>
  );
};

export default WebSearchResults;
