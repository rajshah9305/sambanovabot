import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { createAgent } from '../../services/agentService';
import { getAvailableModels } from '../../services/agentService';
import { getKnowledgeBases } from '../../services/knowledgeBaseService';
import ModelSelector from '../../components/agents/ModelSelector';
import KnowledgeBaseSelector from '../../components/agents/KnowledgeBaseSelector';

// Form validation schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required').max(50, 'Name cannot exceed 50 characters'),
  description: yup
    .string()
    .required('Description is required')
    .max(500, 'Description cannot exceed 500 characters'),
  instructions: yup
    .string()
    .required('Instructions are required')
    .max(10000, 'Instructions cannot exceed 10000 characters'),
  model: yup.string().required('Model is required'),
  temperature: yup
    .number()
    .required('Temperature is required')
    .min(0, 'Temperature must be at least 0')
    .max(2, 'Temperature cannot exceed 2'),
  maxTokens: yup
    .number()
    .required('Max tokens is required')
    .min(1, 'Max tokens must be at least 1')
    .max(32768, 'Max tokens cannot exceed 32768'),
  enableWebSearch: yup.boolean(),
  enableFollowupQuestions: yup.boolean(),
  isPublic: yup.boolean(),
  allowNSFW: yup.boolean(),
  nsfwCategories: yup.array().of(
    yup.string().oneOf([
      'adult_content',
      'hate_speech',
      'violence',
      'self_harm',
      'sexual_content',
      'harassment',
      'shock_content',
      'illegal_activity'
    ])
  ),
  knowledgeBases: yup.array().of(yup.string()),
});

const AgentCreate = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState([]);
  const [selectedNSFWCategories, setSelectedNSFWCategories] = useState([]);

  // Fetch available models
  const {
    data: modelsData,
    isLoading: modelsLoading,
    error: modelsError,
  } = useQuery({
    queryKey: ['models'],
    queryFn: getAvailableModels,
  });

  // Fetch knowledge bases
  const {
    data: knowledgeBasesData,
    isLoading: knowledgeBasesLoading,
    error: knowledgeBasesError,
  } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: getKnowledgeBases,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      instructions: 'You are a helpful AI assistant.',
      model: '',
      temperature: 0.7,
      maxTokens: 2048,
      enableWebSearch: false,
      enableFollowupQuestions: true,
      isPublic: false,
      allowNSFW: false,
      nsfwCategories: [],
      knowledgeBases: [],
    },
  });

  // Watch for form value changes
  const selectedModel = watch('model');

  // Update max tokens based on selected model
  useEffect(() => {
    if (selectedModel && modelsData) {
      const model = modelsData.data.find((m) => m.id === selectedModel);
      if (model) {
        setValue('maxTokens', model.maxTokens);
      }
    }
  }, [selectedModel, modelsData, setValue]);

  // Handle knowledge base selection
  const handleKnowledgeBaseChange = (selectedIds) => {
    setSelectedKnowledgeBases(selectedIds);
    setValue('knowledgeBases', selectedIds);
  };

  // Handle NSFW categories selection
  const handleNSFWCategoriesChange = (selectedCategories) => {
    setSelectedNSFWCategories(selectedCategories);
    setValue('nsfwCategories', selectedCategories);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await createAgent(data);
      navigate(`/agents/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create agent. Please try again.');
      setIsSubmitting(false);
    }
  };

  const isLoading = modelsLoading || knowledgeBasesLoading;
  const hasError = modelsError || knowledgeBasesError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-md">
        Error loading data. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/agents')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Create New Agent</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md flex items-start">
            <FiAlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Basic Information</h2>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Name *
              </label>
              <input
                type="text"
                {...register('name')}
                className={`w-full px-3 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                  errors.name ? 'border-red-500 dark:border-red-500' : ''
                }`}
                placeholder="My AI Assistant"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows="3"
                className={`w-full px-3 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                  errors.description ? 'border-red-500 dark:border-red-500' : ''
                }`}
                placeholder="A helpful AI assistant that can answer questions about various topics."
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Instructions *
              </label>
              <textarea
                {...register('instructions')}
                rows="6"
                className={`w-full px-3 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                  errors.instructions ? 'border-red-500 dark:border-red-500' : ''
                }`}
                placeholder="You are a helpful AI assistant. Answer questions accurately and concisely."
              ></textarea>
              {errors.instructions && (
                <p className="mt-1 text-sm text-red-500">{errors.instructions.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Detailed instructions for the AI model about its role, behavior, and limitations.
              </p>
            </div>
          </div>

          {/* Model Settings */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Model Settings</h2>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                AI Model *
              </label>
              <ModelSelector
                models={modelsData?.data || []}
                selectedModel={selectedModel}
                onChange={(model) => setValue('model', model)}
                error={errors.model}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Temperature *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  {...register('temperature')}
                  className={`w-full px-3 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                    errors.temperature ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                />
                {errors.temperature && (
                  <p className="mt-1 text-sm text-red-500">{errors.temperature.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Controls randomness: 0 = deterministic, 2 = maximum creativity
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Max Tokens *
                </label>
                <input
                  type="number"
                  min="1"
                  max="32768"
                  {...register('maxTokens')}
                  className={`w-full px-3 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                    errors.maxTokens ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                />
                {errors.maxTokens && (
                  <p className="mt-1 text-sm text-red-500">{errors.maxTokens.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Maximum length of generated responses
                </p>
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Capabilities</h2>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableWebSearch"
                {...register('enableWebSearch')}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label
                htmlFor="enableWebSearch"
                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Enable Web Search
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableFollowupQuestions"
                {...register('enableFollowupQuestions')}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label
                htmlFor="enableFollowupQuestions"
                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Enable Follow-up Questions
              </label>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Knowledge Bases
              </label>
              <KnowledgeBaseSelector
                knowledgeBases={knowledgeBasesData?.data || []}
                selectedIds={selectedKnowledgeBases}
                onChange={handleKnowledgeBaseChange}
              />
            </div>
          </div>

          {/* Visibility & Content Settings */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Visibility & Content Settings</h2>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                {...register('isPublic')}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label
                htmlFor="isPublic"
                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Make this agent public (visible to all users)
              </label>
            </div>

            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">NSFW Content Settings</h3>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="allowNSFW"
                  {...register('allowNSFW')}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label
                  htmlFor="allowNSFW"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Allow NSFW Content
                </label>
              </div>

              {watch('allowNSFW') && (
                <div className="ml-6 space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Select which types of NSFW content this agent should be allowed to discuss:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="adult_content"
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...selectedNSFWCategories, 'adult_content']
                            : selectedNSFWCategories.filter(cat => cat !== 'adult_content');
                          handleNSFWCategoriesChange(newCategories);
                        }}
                        checked={selectedNSFWCategories.includes('adult_content')}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label
                        htmlFor="adult_content"
                        className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Adult Content
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sexual_content"
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...selectedNSFWCategories, 'sexual_content']
                            : selectedNSFWCategories.filter(cat => cat !== 'sexual_content');
                          handleNSFWCategoriesChange(newCategories);
                        }}
                        checked={selectedNSFWCategories.includes('sexual_content')}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label
                        htmlFor="sexual_content"
                        className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Sexual Content
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="violence"
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...selectedNSFWCategories, 'violence']
                            : selectedNSFWCategories.filter(cat => cat !== 'violence');
                          handleNSFWCategoriesChange(newCategories);
                        }}
                        checked={selectedNSFWCategories.includes('violence')}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label
                        htmlFor="violence"
                        className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Violence
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="hate_speech"
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...selectedNSFWCategories, 'hate_speech']
                            : selectedNSFWCategories.filter(cat => cat !== 'hate_speech');
                          handleNSFWCategoriesChange(newCategories);
                        }}
                        checked={selectedNSFWCategories.includes('hate_speech')}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label
                        htmlFor="hate_speech"
                        className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Hate Speech
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="harassment"
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...selectedNSFWCategories, 'harassment']
                            : selectedNSFWCategories.filter(cat => cat !== 'harassment');
                          handleNSFWCategoriesChange(newCategories);
                        }}
                        checked={selectedNSFWCategories.includes('harassment')}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label
                        htmlFor="harassment"
                        className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Harassment
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="shock_content"
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...selectedNSFWCategories, 'shock_content']
                            : selectedNSFWCategories.filter(cat => cat !== 'shock_content');
                          handleNSFWCategoriesChange(newCategories);
                        }}
                        checked={selectedNSFWCategories.includes('shock_content')}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label
                        htmlFor="shock_content"
                        className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Shock Content
                      </label>
                    </div>
                  </div>

                  <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-md text-sm">
                    <p className="font-medium">Important Note:</p>
                    <p className="mt-1">
                      Enabling NSFW content may allow the agent to discuss sensitive topics that could be inappropriate for some users.
                      Always ensure compliance with applicable laws and regulations.
                    </p>
                    <p className="mt-1">
                      Some categories like self-harm and illegal activities remain restricted for safety and legal reasons.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentCreate;
