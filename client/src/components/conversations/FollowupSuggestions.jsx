import { FiMessageSquare, FiCornerDownRight } from 'react-icons/fi';

const FollowupSuggestions = ({ suggestions, onSuggestionClick, selectedSuggestion }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-3">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mr-2">
          <FiCornerDownRight className="w-3 h-3" />
        </div>
        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Suggested follow-up questions
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
              selectedSuggestion === suggestion
                ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700/50 dark:text-primary-300 shadow-sm'
                : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:border-neutral-600'
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
