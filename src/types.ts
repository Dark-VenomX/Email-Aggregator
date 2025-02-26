export type EmailCategory = 'Interested' | 'Meeting Booked' | 'Not Interested' | 'Spam' | 'Out of Office';

export interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  date: Date;
  category: EmailCategory;
  account: string;
  folder: string;
  read: boolean;
  suggestedReply?: string;
}

export interface EmailTemplate {
  type: string;
  content: string;
  response: string;
}