import React from 'react';
import { useEmailStore } from '../store';
import { PieChart, BarChart2, Clock, Mail } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { emails } = useEmailStore();

  const stats = {
    total: emails.length,
    unread: emails.filter(e => !e.read).length,
    categories: Object.entries(
      emails.reduce((acc, email) => {
        acc[email.category] = (acc[email.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ),
    accounts: Object.entries(
      emails.reduce((acc, email) => {
        acc[email.account] = (acc[email.account] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    )
  };

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      <div className="col-span-2">
        <h2 className="text-2xl font-semibold mb-4">Email Dashboard</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-medium">Overview</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600">Total Emails</p>
            <p className="text-2xl font-semibold">{stats.total}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600">Unread</p>
            <p className="text-2xl font-semibold">{stats.unread}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <PieChart className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-medium">Categories</h3>
        </div>
        <div className="space-y-3">
          {stats.categories.map(([category, count]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-gray-600">{category}</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart2 className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-medium">Account Distribution</h3>
        </div>
        <div className="space-y-3">
          {stats.accounts.map(([account, count]) => (
            <div key={account} className="flex items-center justify-between">
              <span className="text-gray-600">{account}</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-medium">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {emails
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 5)
            .map(email => (
              <div key={email.id} className="text-sm">
                <p className="font-medium">{email.subject}</p>
                <p className="text-gray-500">{email.from}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};