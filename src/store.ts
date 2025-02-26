import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Email, EmailCategory } from './types';
import { mockEmails, emailTemplates } from './mockData';
import { categorizeEmail as aiCategorizeEmail } from './utils/emailCategorizer';
import { sendSlackNotification } from './services/notifications';
import { v4 as uuidv4 } from 'uuid';

interface EmailStore {
  emails: Email[];
  searchTerm: string;
  selectedAccount: string | null;
  selectedFolder: string | null;
  selectedEmail: Email | null;
  isDarkMode: boolean;
  setSearchTerm: (term: string) => void;
  setSelectedAccount: (account: string | null) => void;
  setSelectedFolder: (folder: string | null) => void;
  setSelectedEmail: (email: Email | null) => void;
  toggleDarkMode: () => void;
  markAsRead: (id: string) => void;
  categorizeEmail: (id: string, category: EmailCategory) => void;
  getSuggestedReply: (email: Email) => string | undefined;
  sendWebhook: (email: Email) => void;
  fetchEmails: () => Promise<void>;
  autoCategorizeEmail: (id: string) => void;
  sendEmail: (from: string, to: string, subject: string, body: string) => void;
}

export const useEmailStore = create<EmailStore>()(
  persist(
    (set, get) => ({
      emails: mockEmails,
      searchTerm: '',
      selectedAccount: null,
      selectedFolder: null,
      selectedEmail: null,
      isDarkMode: false,
      setSearchTerm: (term) => set({ searchTerm: term }),
      setSelectedAccount: (account) => set({ selectedAccount: account }),
      setSelectedFolder: (folder) => set({ selectedFolder: folder }),
      setSelectedEmail: (email) => set({ selectedEmail: email }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      markAsRead: (id) =>
        set((state) => ({
          emails: state.emails.map((email) =>
            email.id === id ? { ...email, read: true } : email
          ),
        })),
      sendEmail: (from, to, subject, body) => {
        const newEmail: Email = {
          id: uuidv4(),
          from,
          subject,
          body,
          date: new Date(),
          category: 'Interested',
          account: to,
          folder: 'Inbox',
          read: false
        };

        set((state) => ({
          emails: [...state.emails, newEmail]
        }));
      },
      categorizeEmail: (id, category) => {
        set((state) => ({
          emails: state.emails.map((email) =>
            email.id === id ? { ...email, category } : email
          ),
        }));

        const email = get().emails.find(e => e.id === id);
        if (email && category === 'Interested') {
          get().sendWebhook(email);
          sendSlackNotification(email);
        }
      },
      autoCategorizeEmail: (id) => {
        const email = get().emails.find(e => e.id === id);
        if (email) {
          const category = aiCategorizeEmail(email);
          get().categorizeEmail(id, category);
        }
      },
      getSuggestedReply: (email) => {
        for (const template of emailTemplates) {
          const keywords = template.content.split('|');
          if (keywords.some(keyword => 
            email.subject.toLowerCase().includes(keyword) || 
            email.body.toLowerCase().includes(keyword)
          )) {
            return template.response;
          }
        }
        return undefined;
      },
      sendWebhook: async (email) => {
        try {
          const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
          if (!webhookUrl) {
            console.error('Webhook URL not configured in environment variables');
            return;
          }

          console.log('Sending webhook to:', webhookUrl);
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'interested_lead',
              email: {
                from: email.from,
                subject: email.subject,
                category: email.category,
                date: email.date,
                preview: email.body.substring(0, 200)
              },
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          console.log('Webhook sent successfully');
        } catch (error) {
          console.error('Failed to send webhook:', error);
        }
      },
      fetchEmails: async () => {
        try {
          const response = await fetch('http://localhost:3000/api/emails');
          const emails = await response.json();
          set({ emails });
        } catch (error) {
          console.error('Failed to fetch emails:', error);
        }
      },
    }),
    {
      name: 'email-store',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);