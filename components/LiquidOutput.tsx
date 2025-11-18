
import React, { useState, useEffect, memo } from 'react';

// Declare Prism on the window object for TypeScript
declare global {
  interface Window {
    Prism: any;
  }
}

interface CodeDisplayProps {
  code: string;
  isLoading: boolean;
  language: 'liquid' | 'json';
  placeholder: string;
}

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-500">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

// Memoize the component to prevent re-renders when props haven't changed.
export const CodeDisplay: React.FC<CodeDisplayProps> = memo(({ code, isLoading, language, placeholder }) => {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>('');

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  useEffect(() => {
    if (code && window.Prism) {
        if (window.Prism.languages[language]) {
            const html = window.Prism.highlight(code, window.Prism.languages[language], language);
            setHighlightedCode(html);
        } else {
            // Fallback to plain text if grammar isn't ready
            setHighlightedCode(code.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
        }
    } else {
      setHighlightedCode('');
    }
  }, [code, language]);


  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
    }
  };

  const themeClass = language === 'liquid' ? 'dark:bg-[#272822]' : 'dark:bg-gray-800';

  return (
    <div className={`relative h-full flex flex-col rounded-lg overflow-hidden bg-gray-50 ${themeClass}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-800/70 z-10 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-sky-500"></div>
        </div>
      )}
      <pre className={`flex-grow overflow-auto p-4 language-${language} !bg-transparent`}>
        {code ? (
           <code
             className="font-mono text-sm whitespace-pre-wrap"
             dangerouslySetInnerHTML={{ __html: highlightedCode }}
           />
        ) : (
            <code className="font-mono text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
                {isLoading ? '' : placeholder}
            </code>
        )}
      </pre>
      {code && !isLoading && (
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 flex items-center px-3 py-1 bg-white/50 dark:bg-black/30 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-md backdrop-blur-sm hover:bg-gray-200/70 dark:hover:bg-black/50 transition-colors"
        >
          {copied ? <><CheckIcon /> <span className="ml-1">Copied!</span></> : <><CopyIcon /><span className="ml-1">Copy</span></>}
        </button>
      )}
    </div>
  );
});
