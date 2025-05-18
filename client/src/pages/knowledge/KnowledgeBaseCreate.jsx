import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { FiAlertCircle, FiArrowLeft, FiUpload } from 'react-icons/fi';
import { createKnowledgeBase } from '../../services/knowledgeBaseService';

// Form validation schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required').max(50, 'Name cannot exceed 50 characters'),
  description: yup
    .string()
    .required('Description is required')
    .max(500, 'Description cannot exceed 500 characters'),
  embeddingModel: yup.string().required('Embedding model is required'),
});

const KnowledgeBaseCreate = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      embeddingModel: 'sambanova/e5-large-v2',
    },
  });

  // Create knowledge base mutation
  const createKnowledgeBaseMutation = useMutation({
    mutationFn: createKnowledgeBase,
    onSuccess: (data) => {
      navigate(`/knowledge-bases/${data.data._id}`);
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to create knowledge base. Please try again.');
      setIsSubmitting(false);
    },
  });

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('embeddingModel', data.embeddingModel);
    
    // Append files if any
    files.forEach((file) => {
      formData.append('documents', file);
    });

    createKnowledgeBaseMutation.mutate(formData);
  };

  return (
    <div className="container px-4 mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/knowledge-bases')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Create Knowledge Base
        </h1>
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
                placeholder="Product Documentation"
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
                placeholder="Knowledge base containing product documentation and FAQs."
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Embedding Model */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Embedding Model</h2>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Embedding Model *
              </label>
              <select
                {...register('embeddingModel')}
                className={`w-full px-3 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                  errors.embeddingModel ? 'border-red-500 dark:border-red-500' : ''
                }`}
              >
                <option value="sambanova/e5-large-v2">E5 Large v2</option>
                <option value="sambanova/bge-large-en">BGE Large English</option>
              </select>
              {errors.embeddingModel && (
                <p className="mt-1 text-sm text-red-500">{errors.embeddingModel.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                The model used to generate embeddings for semantic search.
              </p>
            </div>
          </div>

          {/* Document Upload */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Documents (Optional)</h2>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                id="documents"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.txt,.md,.doc,.docx"
              />
              <label
                htmlFor="documents"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <FiUpload className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Drag and drop files here or click to browse
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Supported formats: PDF, TXT, MD, DOC, DOCX
                </p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selected Files ({files.length})
                </h3>
                <ul className="space-y-1 max-h-40 overflow-y-auto">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 dark:text-gray-400 flex items-center"
                    >
                      <span className="truncate">{file.name}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Knowledge Base'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KnowledgeBaseCreate;
