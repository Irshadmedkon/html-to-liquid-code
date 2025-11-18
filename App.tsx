
import React, { useState, useCallback, useEffect } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { Preview } from './components/Preview';
import { GeneratedInfo } from './components/GeneratedInfo';
import { convertToLiquid, explainLiquidCode, generateLiquidSchema } from './services/geminiService';

const WandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
        <path d="M15 4V2" /><path d="M15 10V8" /><path d="M12.5 7H17.5" /><path d="M9 4V2" /><path d="M9 10V8" /><path d="M6.5 7H11.5" /><path d="m2 10 1.1-1.1a2 2 0 0 1 2.82 0L8 11" /><path d="m14 16 1.1-1.1a2 2 0 0 1 2.82 0L20 17" /><path d="M12 22v-2" /><path d="M9 18H7" /><path d="M17 18h-2" /><path d="M12 16v-2" />
    </svg>
);

const LogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m14 10-5.5 5.5a2 2 0 0 1-2.82-2.82L11.5 7" /><path d="m16.5 7.5 2.82 2.82a2 2 0 0 1 0 2.82L14.5 18" /><path d="m7 13 2.5 2.5" /><path d="m13 7 2.5 2.5" /><path d="M3 21h18" />
    </svg>
);

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m4.93 17.66 1.41-1.41" /><path d="m17.66 4.93 1.41 1.41" /></svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
);


export default function App() {
  const [htmlCode, setHtmlCode] = useState('<div class="card">\n  <h1>{{ product.title }}</h1>\n  <p>Edit the code to see it live.</p>\n</div>');
  const [cssCode, setCssCode] = useState('body {\n  display: grid;\n  place-content: center;\n  min-height: 100vh;\n  font-family: sans-serif;\n  background-color: #f0f2f5;\n}\n.card {\n  padding: 2rem;\n  border-radius: 1rem;\n  background-color: white;\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n  text-align: center;\n}');
  const [jsCode, setJsCode] = useState('console.log("Welcome to the Liquid Converter!");');
  
  const [liquidCode, setLiquidCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [schema, setSchema] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);
  const [isSchemaLoading, setIsSchemaLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    const lightThemeLink = document.getElementById('prism-light-theme') as HTMLLinkElement | null;
    const darkThemeLink = document.getElementById('prism-dark-theme') as HTMLLinkElement | null;
    if (lightThemeLink && darkThemeLink) {
        lightThemeLink.disabled = theme === 'dark';
        darkThemeLink.disabled = theme === 'light';
    }
  }, [theme]);

  const handleConvert = useCallback(async () => {
    if (!htmlCode && !cssCode && !jsCode) {
      setError('Please provide some code to convert.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setLiquidCode('');
    setExplanation('');
    setSchema('');

    try {
      const result = await convertToLiquid(htmlCode, cssCode, jsCode);
      setLiquidCode(result);
      
      // Once liquid code is generated, start fetching explanation and schema
      setIsExplanationLoading(true);
      setIsSchemaLoading(true);
      
      Promise.all([
        explainLiquidCode(result),
        generateLiquidSchema(result)
      ]).then(([explanationResult, schemaResult]) => {
        setExplanation(explanationResult);
        setSchema(schemaResult);
      }).catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to get additional details.');
      }).finally(() => {
        setIsExplanationLoading(false);
        setIsSchemaLoading(false);
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during conversion.');
    } finally {
      setIsLoading(false);
    }
  }, [htmlCode, cssCode, jsCode]);

  return (
    <div className="min-h-screen font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                    <LogoIcon />
                    <h1 className="text-2xl font-bold">
                        Code to Liquid Converter
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Powered by Gemini</p>
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        <span className="sr-only">Toggle theme</span>
                    </button>
                </div>
            </header>

            <main className="mt-8 flex flex-col gap-12">
                {/* Section 1: Code Input */}
                <section>
                    <div className="flex flex-col gap-2 mb-6">
                        <h2 className="text-xl font-semibold">Step 1: Input Your Code</h2>
                        <p className="text-gray-600 dark:text-gray-400">Provide your HTML, CSS, and JavaScript. The live preview will update as you type.</p>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[300px] md:h-[400px]">
                            <CodeEditor language="HTML / Liquid" value={htmlCode} onChange={setHtmlCode} />
                            <CodeEditor language="CSS" value={cssCode} onChange={setCssCode} />
                        </div>
                        <div className="h-[200px] md:h-[250px]">
                            <CodeEditor language="JavaScript" value={jsCode} onChange={setJsCode} />
                        </div>
                    </div>
                </section>

                {/* Section 2: Action Button */}
                <section className="flex justify-center">
                    <button
                        onClick={handleConvert}
                        disabled={isLoading}
                        className="flex items-center justify-center w-full max-w-md px-6 py-4 bg-blue-600 dark:bg-sky-500 text-white dark:text-gray-900 text-lg font-bold rounded-lg shadow-lg hover:bg-blue-700 dark:hover:bg-sky-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.03] active:scale-[0.98]"
                    >
                        <WandIcon />
                        {isLoading ? 'Converting to Liquid...' : 'Generate Complete Liquid File'}
                    </button>
                </section>

                {/* Section 3: Output */}
                <section>
                    <div className="flex flex-col gap-2 mb-6">
                        <h2 className="text-xl font-semibold">Step 2: Review Your Output</h2>
                        <p className="text-gray-600 dark:text-gray-400">Your live preview and the final generated code will appear below.</p>
                    </div>
                    <div className="flex flex-col gap-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg flex flex-col border border-gray-200 dark:border-gray-700 shadow-sm h-[500px]">
                            <Preview html={htmlCode} css={cssCode} js={jsCode} />
                        </div>
                        
                        <GeneratedInfo
                            liquidCode={liquidCode}
                            explanation={explanation}
                            schema={schema}
                            isLoading={isLoading}
                            isExplanationLoading={isExplanationLoading}
                            isSchemaLoading={isSchemaLoading}
                            error={error}
                        />
                    </div>
                </section>
            </main>
        </div>
    </div>
  );
}
