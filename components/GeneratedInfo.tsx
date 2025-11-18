import React, { useState } from 'react';
import { CodeDisplay } from './LiquidOutput';

interface GeneratedInfoProps {
    liquidCode: string;
    explanation: string;
    schema: string;
    isLoading: boolean;
    isExplanationLoading: boolean;
    isSchemaLoading: boolean;
    error: string | null;
}

type Tab = 'liquid' | 'explanation' | 'schema';

export const GeneratedInfo: React.FC<GeneratedInfoProps> = ({
    liquidCode,
    explanation,
    schema,
    isLoading,
    isExplanationLoading,
    isSchemaLoading,
    error,
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('liquid');

    const TabButton: React.FC<{ tabName: Tab; label: string }> = ({ tabName, label }) => {
        const isActive = activeTab === tabName;
        const activeClasses = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm text-blue-600 dark:text-sky-400';
        const inactiveClasses = 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-gray-300';
        return (
            <button
                onClick={() => setActiveTab(tabName)}
                className={`px-4 py-2 text-sm font-semibold rounded-md border transition-all ${isActive ? activeClasses : inactiveClasses}`}
            >
                {label}
            </button>
        );
    };

    const hasContent = liquidCode || explanation || schema;
    
    if (!hasContent && !isLoading && !error) {
        return (
            <div className="min-h-[400px] flex items-center justify-center text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Your generated code will appear here</h3>
                    <p className="mt-1 text-sm text-gray-500">Click the "Generate" button above to get started.</p>
                </div>
            </div>
        );
    }
    
    if (error && !liquidCode) {
        return (
            <div className="min-h-[400px] flex items-center justify-center text-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                 <div className="text-red-700 dark:text-brand-error text-sm">{error}</div>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-900 rounded-lg mb-4 self-start">
                <TabButton tabName="liquid" label="Liquid File" />
                <TabButton tabName="explanation" label="Explanation" />
                <TabButton tabName="schema" label="Schema" />
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'liquid' && (
                    <CodeDisplay 
                        code={liquidCode} 
                        isLoading={isLoading} 
                        language="liquid"
                        placeholder="// Your complete Liquid file will appear here..." 
                    />
                )}
                {activeTab === 'explanation' && (
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-full min-h-[400px] relative">
                        {isExplanationLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-800/70 z-10 backdrop-blur-sm">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-sky-500"></div>
                            </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                            {explanation || 'No explanation generated.'}
                        </p>
                    </div>
                )}
                {activeTab === 'schema' && (
                    <CodeDisplay 
                        code={schema} 
                        isLoading={isSchemaLoading} 
                        language="json"
                        placeholder="// A Shopify schema will be generated here..." 
                    />
                )}
            </div>
        </div>
    );
};