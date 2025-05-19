import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiExternalLink, FiSearch, FiGlobe } from 'react-icons/fi';

const WebSearchResults = ({ results }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!results || results.length === 0) {
    return null;
  }

  // Show only first 3 results when collapsed
  const displayResults = isExpanded ? results : results.slice(0, 3);

  return (
    <div>
      <div
        className="flex items-center justify-between cursor-pointer mb-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mr-2">
            <FiGlobe className="w-3 h-3" />
          </div>
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Web Search Results
          </h4>
        </div>
        <button className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors duration-200">
          {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className="space-y-3">
        {displayResults.map((result, index) => (
          <div
            key={index}
            className="text-xs bg-white dark:bg-neutral-800 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <a
              href={result.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center"
            >
              {result.title}
              <FiExternalLink className="ml-1 w-3 h-3 flex-shrink-0" />
            </a>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1.5 line-clamp-2">
              {result.snippet}
            </p>
            <div className="flex items-center mt-1.5 text-neutral-500 dark:text-neutral-500">
              <FiGlobe className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{result.link}</span>
            </div>
          </div>
        ))}
      </div>

      {results.length > 3 && !isExpanded && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
          }}
          className="mt-3 px-3 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-full transition-colors duration-200 inline-flex items-center"
        >
          <FiChevronDown className="w-3 h-3 mr-1" />
          Show {results.length - 3} more results
        </button>
      )}
    </div>
  );
};

export default WebSearchResults;
