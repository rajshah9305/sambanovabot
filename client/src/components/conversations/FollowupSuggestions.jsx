import { FiMessageSquare } from 'react-icons/fi';

const FollowupSuggestions = ({ suggestions, onSuggestionClick, selectedSuggestion }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center mb-2">
        <FiMessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Follow-up Questions
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              selectedSuggestion === suggestion
                ? 'bg-primary-100 border-primary-300 text-primary-800 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FollowupSuggestions;
