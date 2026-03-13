import { useEffect, useRef } from 'react';
import { Terminal, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

function LogConsole({ logs, isRunning }) {
  const consoleRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new logs arrive
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogIcon = (level) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLogColor = (level) => {
    switch (level) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'system':
        return 'text-gray-500';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-[calc(100vh-12rem)] flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Terminal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Console Output
          </h2>
          {isRunning && (
            <span className="px-2 py-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-full">
              LIVE
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Real-time automation logs
        </p>
      </div>

      <div
        ref={consoleRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 font-mono text-sm"
      >
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600">
            <Terminal className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">Waiting for automation to start...</p>
            <p className="text-xs mt-1">Logs will appear here in real-time</p>
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              >
                <span className="text-gray-500 dark:text-gray-600 text-xs mt-0.5 flex-shrink-0">
                  {log.timestamp}
                </span>
                <div className="flex-shrink-0 mt-0.5">{getLogIcon(log.level)}</div>
                <span className={`flex-1 ${getLogColor(log.level)} break-words`}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Total logs: {logs.length}</span>
            <span className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>{logs.filter((l) => l.level === 'success').length}</span>
            </span>
            <span className="flex items-center space-x-1">
              <XCircle className="w-3 h-3 text-red-500" />
              <span>{logs.filter((l) => l.level === 'error').length}</span>
            </span>
            <span className="flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-yellow-500" />
              <span>{logs.filter((l) => l.level === 'warning').length}</span>
            </span>
          </div>
          <button
            onClick={() => {
              const logText = logs.map((l) => `[${l.timestamp}] ${l.message}`).join('\n');
              navigator.clipboard.writeText(logText);
            }}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Copy logs
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogConsole;
