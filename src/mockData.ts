import { Email, EmailTemplate } from './types';
import { subDays } from 'date-fns';

export const emailTemplates: EmailTemplate[] = [
  {
    type: 'interview_request',
    content: 'interview|technical interview|schedule a call',
    response: 'Thank you for considering my profile! I would be happy to schedule a technical interview. You can book a time that works best for you here: https://cal.com/example'
  },
  {
    type: 'follow_up',
    content: 'following up|check in|status update',
    response: 'Thank you for following up. I remain very interested in the opportunity and look forward to discussing next steps.'
  }
];

export const mockEmails: Email[] = [
  {
    id: '1',
    from: 'recruiter@techcorp.com',
    subject: 'Interview Request - Senior Developer Position',
    body: 'Hi, Your resume has been shortlisted. When will be a good time for you to attend the technical interview?',
    date: subDays(new Date(), 1),
    category: 'Interested',
    account: 'personal@example.com',
    folder: 'Inbox',
    read: false,
    suggestedReply: 'Thank you for considering my profile! I would be happy to schedule a technical interview. You can book a time that works best for you here: https://cal.com/example'
  },
  {
    id: '2',
    from: 'hr@startup.io',
    subject: 'Following up on your application',
    body: 'Thank you for your interest. We have reviewed your application and would like to proceed with next steps.',
    date: subDays(new Date(), 2),
    category: 'Meeting Booked',
    account: 'personal@example.com',
    folder: 'Inbox',
    read: true,
    suggestedReply: 'Thank you for following up. I remain very interested in the opportunity and look forward to discussing next steps.'
  },
  {
    id: '3',
    from: 'marketing@spam.com',
    subject: 'SPECIAL OFFER!!!',
    body: 'Limited time offer! Act now!',
    date: subDays(new Date(), 3),
    category: 'Spam',
    account: 'work@example.com',
    folder: 'Spam',
    read: false
  },
  {
    id: '4',
    from: 'team@company.com',
    subject: 'Out of Office: Vacation',
    body: 'I will be out of office until next week. For urgent matters, please contact...',
    date: subDays(new Date(), 4),
    category: 'Out of Office',
    account: 'work@example.com',
    folder: 'Inbox',
    read: true
  }
];