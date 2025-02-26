import React from 'react';
import { Search } from 'lucide-react';
import { useEmailStore } from '../store';

export const SearchBar: React.FC = () => {
  const { searchTerm, setSearchTerm } = useEmailStore();

  return (
    <div className="relative flex-1 max-w-xl">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
      <input
        type="text"
        placeholder="Search emails..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white dark:placeholder-gray-400 transition-colors"
      />
    </div>
  );
};