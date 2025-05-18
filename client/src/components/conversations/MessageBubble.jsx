import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FiExternalLink, FiInfo } from 'react-icons/fi';
import WebSearchResults from './WebSearchResults';
import KnowledgeBaseReferences from './KnowledgeBaseReferences';

const MessageBubble = ({ message, isLastMessage }) => {
  const [showMetadata, setShowMetadata] = useState(false);
  
  // Format timestamp
  const formattedTime = message.timestamp 
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  
  // Determine if message has web search results
  const hasWebSearch = message.metadata?.webSearch?.used && message.metadata?.webSearch?.results?.length > 0;
  
  // Determine if message has knowledge base references
  const hasKnowledgeBase = message.metadata?.knowledgeBase?.used && message.metadata?.knowledgeBase?.documents?.length > 0;
  
  // Determine message type and styling
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const isAssistant = message.role === 'assistant';
  
  // Special handling for system messages that contain web search or knowledge base info
  const isWebSearchSystem = isSystem && message.content.includes('Web search results');
  const isKnowledgeBaseSystem = isSystem && message.content.includes('knowledge base');
  
  // Apply different styling based on message type
  const bubbleClasses = isUser
    ? 'bg-primary-600 text-white rounded-lg rounded-tr-none ml-auto'
    : isSystem && (isWebSearchSystem || isKnowledgeBaseSystem)
    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700'
    : isAssistant
    ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg rounded-tl-none border border-gray-200 dark:border-gray-600'
    : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-lg border border-yellow-200 dark:border-yellow-800/30';

  return (
    <div className={`flex items-start ${isUser ? 'justify-end' : 'justify-start'} message-animation`}>
      {!isUser && !isSystem && (
        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 mr-3 flex-shrink-0">
          A
        </div>
      )}
      
      <div className={`p-3 max-w-[80%] ${bubbleClasses}`}>
        {/* Message content with markdown rendering */}
        <div className="prose dark:prose-invert prose-sm max-w-none">
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a 
                  {...props} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {props.children}
                  <FiExternalLink className="inline ml-1 w-3 h-3" />
                </a>
              ),
              pre: ({ node, ...props }) => (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-1 my-2 overflow-x-auto">
                  <pre {...props} />
                </div>
              ),
              code: ({ node, inline, ...props }) => (
                inline 
                  ? <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props} />
                  : <code {...props} />
              )
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        
        {/* Web search results */}
        {hasWebSearch && showMetadata && (
          <WebSearchResults results={message.metadata.webSearch.results} />
        )}
        
        {/* Knowledge base references */}
        {hasKnowledgeBase && showMetadata && (
          <KnowledgeBaseReferences documents={message.metadata.knowledgeBase.documents} />
        )}
        
        {/* Message metadata and timestamp */}
        <div className="flex justify-between items-center mt-2 text-xs">
          <div>
            {(hasWebSearch || hasKnowledgeBase) && (
              <button
                onClick={() => setShowMetadata(!showMetadata)}
                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <FiInfo className="w-3 h-3 mr-1" />
                {showMetadata ? 'Hide sources' : 'Show sources'}
              </button>
            )}
          </div>
          <span className="text-gray-500 dark:text-gray-400">{formattedTime}</span>
        </div>
        
        {/* Model info for the last AI message */}
        {isLastMessage && isAssistant && message.metadata?.modelInfo && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
            <p>
              Model: {message.metadata.modelInfo.model} • 
              Temp: {message.metadata.modelInfo.temperature} • 
              Tokens: {message.metadata.modelInfo.tokenUsage?.total || 0}
            </p>
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white ml-3 flex-shrink-0">
          U
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
