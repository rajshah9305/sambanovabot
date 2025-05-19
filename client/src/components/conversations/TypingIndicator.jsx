const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3 py-2 animate-fade-in">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm opacity-70">
        A
      </div>
      <div className="relative px-4 py-3 bg-white dark:bg-neutral-800 rounded-2xl rounded-tl-none shadow-sm border border-neutral-200 dark:border-neutral-700 animate-pulse">
        <div className="typing-indicator flex space-x-2 px-1">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="absolute left-[-6px] top-3 w-3 h-3 transform rotate-45 bg-white dark:bg-neutral-800 border-l border-t border-neutral-200 dark:border-neutral-700"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
