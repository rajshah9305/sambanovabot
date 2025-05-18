import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const ModelSelector = ({ models, selectedModel, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Group models by category
  const groupedModels = models.reduce((acc, model) => {
    // Extract category from model ID (e.g., "llama", "claude", etc.)
    let category = 'Other';
    
    if (model.id.includes('llama')) {
      category = 'Llama';
    } else if (model.id.includes('claude')) {
      category = 'Claude';
    } else if (model.id.includes('gemma')) {
      category = 'Gemma';
    } else if (model.id.includes('mixtral')) {
      category = 'Mixtral';
    } else if (model.id.includes('command')) {
      category = 'Command';
    } else if (model.id.includes('falcon')) {
      category = 'Falcon';
    } else if (model.id.includes('pythia')) {
      category = 'Pythia';
    }
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push(model);
    return acc;
  }, {});

  // Filter models based on search term
  const filteredModels = Object.entries(groupedModels).reduce((acc, [category, models]) => {
    const filtered = models.filter(
      (model) =>
        model.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    
    return acc;
  }, {});

  // Get selected model details
  const selectedModelDetails = models.find((model) => model.id === selectedModel);

  return (
    <div className="relative">
      <button
        type="button"
        className={`w-full flex items-center justify-between px-3 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
          error ? 'border-red-500 dark:border-red-500' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {selectedModel ? (
            <div>
              <div className="font-medium">{selectedModelDetails?.name || selectedModel}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {selectedModelDetails?.description || ''}
              </div>
            </div>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Select a model</span>
          )}
        </div>
        {isOpen ? (
          <FiChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <FiChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-2">
            <input
              type="text"
              className="w-full px-3 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {Object.entries(filteredModels).map(([category, models]) => (
              <div key={category} className="px-2 py-1">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 py-1">
                  {category}
                </div>
                {models.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    className={`w-full text-left px-2 py-2 text-sm rounded-md ${
                      selectedModel === model.id
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => {
                      onChange(model.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="font-medium">{model.name || model.id}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {model.description}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Max tokens: {model.maxTokens}
                    </div>
                  </button>
                ))}
              </div>
            ))}
            {Object.keys(filteredModels).length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No models found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
