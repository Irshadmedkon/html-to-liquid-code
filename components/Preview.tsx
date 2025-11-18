
import React from 'react';

interface PreviewProps {
  html: string;
  css: string;
  js: string;
}

const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
);


export const Preview: React.FC<PreviewProps> = ({ html, css, js }) => {
  const srcDoc = `
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
    </html>
  `;

  const handleOpenInNewTab = () => {
    const blob = new Blob([srcDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener,noreferrer');
    URL.revokeObjectURL(url); // Clean up the object URL
  };


  return (
    <div className="h-full flex flex-col">
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Live Preview</h3>
            <button
                onClick={handleOpenInNewTab}
                className="flex items-center text-xs px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
                <ExternalLinkIcon />
                Open in New Tab
            </button>
        </div>
        <iframe
          srcDoc={srcDoc}
          title="Live Preview"
          sandbox="allow-scripts"
          frameBorder="0"
          className="w-full flex-grow bg-white rounded-b-md"
        />
    </div>
  );
};
