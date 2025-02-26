import React from 'react';
import { useEmailStore } from '../store';
import { format } from 'date-fns';
import { Mail, Star, Trash2, Clock, AlertCircle, CheckCircle, MessageSquare, Wand2 } from 'lucide-react';
import { EmailCategory } from '../types';

const categoryIcons: Record<EmailCategory, React.ReactNode> = {
  'Interested': <Star className="w-4 h-4 text-yellow-500" />,
  'Meeting Booked': <CheckCircle className="w-4 h-4 text-green-500" />,
  'Not Interested': <Trash2 className="w-4 h-4 text-red-500" />,
  'Spam': <AlertCircle className="w-4 h-4 text-red-500" />,
  'Out of Office': <Clock className="w-4 h-4 text-blue-500" />
};

export const EmailList: React.FC = () => {
  const { 
    emails, 
    searchTerm, 
    selectedAccount, 
    selectedFolder, 
    selectedEmail,
    markAsRead,
    setSelectedEmail,
    categorizeEmail,
    autoCategorizeEmail,
    getSuggestedReply
  } = useEmailStore();

  const filteredEmails = emails.filter(email => {
    const matchesSearch = searchTerm === '' || 
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccount = !selectedAccount || email.account === selectedAccount;
    const matchesFolder = !selectedFolder || email.folder === selectedFolder;
    return matchesSearch && matchesAccount && matchesFolder;
  });

  return (
    <div className="flex h-full">
      <div className="w-1/2 divide-y divide-gray-200 dark:divide-gray-700 border-r border-gray-200 dark:border-gray-700">
        {filteredEmails.map(email => (
          <div 
            key={email.id}
            className={`p-4 hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer transition-colors animate-fade-in ${
              !email.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            } ${selectedEmail?.id === email.id ? 'bg-blue-100 dark:bg-blue-900/40' : ''}`}
            onClick={() => {
              markAsRead(email.id);
              setSelectedEmail(email);
            }}
          >
            <div className="flex items-center gap-4">
              <Mail className={`w-5 h-5 ${email.read ? 'text-gray-400 dark:text-gray-500' : 'text-blue-500'}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium dark:text-gray-200">{email.from}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {format(email.date, 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {categoryIcons[email.category]}
                  <span className="text-sm text-gray-600 dark:text-gray-400">{email.category}</span>
                </div>
                <h3 className={`mt-1 dark:text-gray-200 ${!email.read ? 'font-semibold' : ''}`}>
                  {email.subject}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{email.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedEmail && (
        <div className="w-1/2 p-6 animate-slide-in">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold dark:text-white mb-2">{selectedEmail.subject}</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 dark:text-gray-400">{selectedEmail.from}</span>
              <span className="text-gray-500 dark:text-gray-400">
                {format(selectedEmail.date, 'MMM d, yyyy h:mm a')}
              </span>
            </div>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{selectedEmail.body}</p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold dark:text-white">Actions</h3>
              <button
                onClick={() => autoCategorizeEmail(selectedEmail.id)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors animate-scale"
              >
                <Wand2 className="w-4 h-4" />
                Auto-categorize
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {Object.entries(categoryIcons).map(([category]) => (
                  <button
                    key={category}
                    onClick={() => categorizeEmail(selectedEmail.id, category as EmailCategory)}
                    className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all animate-scale ${
                      selectedEmail.category === category
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {categoryIcons[category as EmailCategory]}
                    {category}
                  </button>
                ))}
              </div>

              {getSuggestedReply(selectedEmail) && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <h4 className="font-medium dark:text-white">Suggested Reply</h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{getSuggestedReply(selectedEmail)}</p>
                  <button 
                    className="mt-2 text-sm text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(getSuggestedReply(selectedEmail) || '');
                    }}
                  >
                    Copy to clipboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};