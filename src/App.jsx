import { useState, useEffect } from 'react';
import { Moon, Sun, Loader2 } from 'lucide-react';
import AutomationForm from './components/AutomationForm';
import LogConsole from './components/LogConsole';
import { connectWebSocket, getStatus } from './services/api';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Apply dark mode class to html element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Check initial status
    checkStatus();

    // Connect WebSocket
    const websocket = connectWebSocket(
      (logData) => {
        if (logData.message !== 'ping') {
          setLogs((prev) => [...prev, logData]);
        }
      },
      (error) => {
        console.error('WebSocket error:', error);
      }
    );

    setWs(websocket);

    // Cleanup on unmount
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  const checkStatus = async () => {
    try {
      const status = await getStatus();
      setIsRunning(status.is_running);
    } catch (error) {
      console.error('Failed to check status:', error);
    }
  };

  const handleRunStart = () => {
    setIsRunning(true);
    setLogs([]);
  };

  const handleRunComplete = () => {
    setIsRunning(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  LinkedIn Automation
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Automated job application system
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isRunning && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Running...
                  </span>
                </div>
              )}

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <AutomationForm 
              onRunStart={handleRunStart}
              onRunComplete={handleRunComplete}
              isRunning={isRunning}
            />
          </div>

          {/* Right Column - Logs */}
          <div className="space-y-6">
            <LogConsole logs={logs} isRunning={isRunning} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            LinkedIn Automation Dashboard © 2024
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
