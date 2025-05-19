import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FiExternalLink, FiInfo, FiCpu, FiThermometer, FiHash } from 'react-icons/fi';
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

  // Determine message type
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const isAssistant = message.role === 'assistant';

  // Special handling for system messages
  const isWebSearchSystem = isSystem && message.content.includes('Web search results');
  const isKnowledgeBaseSystem = isSystem && message.content.includes('knowledge base');

  // Get avatar letter
  const getAvatarLetter = () => {
    if (isUser) {
      return message.user?.name?.charAt(0).toUpperCase() || 'U';
    } else if (isAssistant) {
      return 'A';
    } else {
      return 'S';
    }
  };

  return (
    <div className={`group flex items-start gap-3 py-2 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      {/* Avatar for assistant or system */}
      {!isUser && (
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
          isAssistant
            ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white'
            : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
        }`}>
          {getAvatarLetter()}
        </div>
      )}

      {/* Message bubble */}
      <div className={`relative px-4 py-3 max-w-[85%] md:max-w-[75%] shadow-sm ${
        isUser
          ? 'message-bubble-user animate-slide-in-right'
          : isSystem
            ? 'message-bubble-system animate-slide-in-left'
            : 'message-bubble-assistant animate-slide-in-left'
      }`}>
        {/* Message content with markdown rendering */}
        <div className="prose-chat">
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center"
                >
                  {props.children}
                  <FiExternalLink className="inline ml-1 w-3 h-3" />
                </a>
              ),
              pre: ({ node, ...props }) => (
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 my-3 overflow-x-auto">
                  <pre {...props} />
                </div>
              ),
              code: ({ node, inline, ...props }) => (
                inline
                  ? <code className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                  : <code className="font-mono" {...props} />
              )
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Web search results */}
        {hasWebSearch && showMetadata && (
          <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700 animate-fade-in">
            <WebSearchResults results={message.metadata.webSearch.results} />
          </div>
        )}

        {/* Knowledge base references */}
        {hasKnowledgeBase && showMetadata && (
          <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700 animate-fade-in">
            <KnowledgeBaseReferences documents={message.metadata.knowledgeBase.documents} />
          </div>
        )}

        {/* Message metadata and timestamp */}
        <div className="flex justify-between items-center mt-2 text-xs">
          <div>
            {(hasWebSearch || hasKnowledgeBase) && (
              <button
                onClick={() => setShowMetadata(!showMetadata)}
                className="flex items-center px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200"
              >
                <FiInfo className="w-3 h-3 mr-1" />
                {showMetadata ? 'Hide sources' : 'Show sources'}
              </button>
            )}
          </div>
          <span className="text-neutral-500 dark:text-neutral-400">{formattedTime}</span>
        </div>

        {/* Model info for the last AI message */}
        {isLastMessage && isAssistant && message.metadata?.modelInfo && (
          <div className="mt-3 pt-2 border-t border-neutral-200 dark:border-neutral-700 text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center">
                <FiCpu className="w-3 h-3 mr-1" />
                <span>{message.metadata.modelInfo.model}</span>
              </div>
              <div className="flex items-center">
                <FiThermometer className="w-3 h-3 mr-1" />
                <span>Temp: {message.metadata.modelInfo.temperature}</span>
              </div>
              <div className="flex items-center">
                <FiHash className="w-3 h-3 mr-1" />
                <span>Tokens: {message.metadata.modelInfo.tokenUsage?.total || 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* Message pointer */}
        <div className={`absolute top-3 ${isUser ? 'right-[-6px]' : isAssistant ? 'left-[-6px]' : 'hidden'} w-3 h-3 transform rotate-45 ${
          isUser
            ? 'bg-primary-600'
            : 'bg-white dark:bg-neutral-800 border-l border-t border-neutral-200 dark:border-neutral-700'
        }`}></div>
      </div>

      {/* Avatar for user */}
      {isUser && (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
          {getAvatarLetter()}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
