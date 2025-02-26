import React from 'react';
import { useEmailStore } from '../store';
import { Inbox, Send, Archive, Trash2, Mail, BarChart } from 'lucide-react';

const accounts = [
  'personal@example.com',
  'work@example.com'
];

const folders = [
  { name: 'Inbox', icon: Inbox },
  { name: 'Sent', icon: Send },
  { name: 'Archive', icon: Archive },
  { name: 'Spam', icon: Trash2 }
];

interface SidebarProps {
  onShowDashboard: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onShowDashboard }) => {
  const { selectedAccount, selectedFolder, setSelectedAccount, setSelectedFolder } = useEmailStore();

  return (
    <div className="w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 border-r border-gray-200 dark:border-gray-700 h-screen">
      <div className="flex items-center gap-2 mb-8">
        <Mail className="w-6 h-6 text-blue-500" />
        <h1 className="text-xl font-semibold dark:text-white">Email Manager</h1>
      </div>

      <button
        onClick={onShowDashboard}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-6 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all animate-scale"
      >
        <BarChart className="w-4 h-4" />
        Dashboard
      </button>

      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Accounts</h2>
        {accounts.map(account => (
          <button
            key={account}
            className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-all animate-scale ${
              selectedAccount === account
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => setSelectedAccount(account === selectedAccount ? null : account)}
          >
            {account}
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Folders</h2>
        {folders.map(({ name, icon: Icon }) => (
          <button
            key={name}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-1 transition-all animate-scale ${
              selectedFolder === name
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => setSelectedFolder(name === selectedFolder ? null : name)}
          >
            <Icon className="w-4 h-4" />
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};