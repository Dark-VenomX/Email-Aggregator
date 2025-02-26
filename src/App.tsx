import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { EmailList } from './components/EmailList';
import { Dashboard } from './components/Dashboard';
import { ComposeEmail } from './components/ComposeEmail';
import { PlusCircle, Sun, Moon } from 'lucide-react';
import { useEmailStore } from './store';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const { isDarkMode, toggleDarkMode } = useEmailStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/30 dark:to-purple-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(120,119,198,0.3),transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,rgba(120,119,198,0.15),transparent)]" />
      </div>

      <Sidebar onShowDashboard={() => setShowDashboard(true)} />
      <div className="flex-1 flex flex-col relative">
        <div className="p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <SearchBar />
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
              <button
                onClick={() => setShowCompose(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                Compose
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          {showDashboard ? <Dashboard /> : <EmailList />}
        </div>
      </div>
      {showCompose && <ComposeEmail onClose={() => setShowCompose(false)} />}
    </div>
  );
}

export default App;