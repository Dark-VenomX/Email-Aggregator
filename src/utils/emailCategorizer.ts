import { Email, EmailCategory } from '../types';

// Training data for each category with patterns
const categoryPatterns: Record<EmailCategory, RegExp[]> = {
  Interested: [
    /interested in learning more/i,
    /would like to proceed/i,
    /next steps/i,
    /looking forward/i,
    /when can we meet/i,
    /schedule a call/i,
    /tell me more/i,
    /sounds interesting/i,
    /would love to discuss/i,
    /please provide more information/i
  ],
  'Meeting Booked': [
    /meeting confirmed/i,
    /calendar invite/i,
    /scheduled for/i,
    /appointment confirmed/i,
    /meeting is set/i,
    /looking forward to our call/i,
    /see you at/i,
    /conference details/i,
    /zoom\.us\//i,
    /meet\.google\.com/i
  ],
  'Not Interested': [
    /not a good fit/i,
    /unfortunately/i,
    /not at this time/i,
    /decided to go with/i,
    /other candidates/i,
    /not moving forward/i,
    /different direction/i,
    /not interested/i,
    /best of luck/i,
    /thank you for your time/i
  ],
  Spam: [
    /viagra/i,
    /lottery/i,
    /prince/i,
    /won.*prize/i,
    /inheritance/i,
    /cryptocurrency/i,
    /investment opportunity/i,
    /make money fast/i,
    /work from home/i,
    /limited time offer/i
  ],
  'Out of Office': [
    /out of office/i,
    /vacation/i,
    /holiday/i,
    /away from/i,
    /auto-?reply/i,
    /automatic reply/i,
    /return to office/i,
    /will respond/i,
    /limited access/i,
    /back on/i
  ]
};

// Helper function to extract text content from email
function getEmailContent(email: Email): string {
  return `${email.subject} ${email.body}`;
}

// Score calculation for each category
function calculateCategoryScores(text: string): Record<EmailCategory, number> {
  const scores: Record<EmailCategory, number> = {
    'Interested': 0,
    'Meeting Booked': 0,
    'Not Interested': 0,
    'Spam': 0,
    'Out of Office': 0
  };

  // Check each category's patterns
  Object.entries(categoryPatterns).forEach(([category, patterns]) => {
    patterns.forEach(pattern => {
      if (pattern.test(text)) {
        scores[category as EmailCategory] += 1;
      }
    });
  });

  return scores;
}

// Main categorization function
export function categorizeEmail(email: Email): EmailCategory {
  const content = getEmailContent(email);
  const scores = calculateCategoryScores(content);
  
  // Special case for auto-replies
  if (/auto-?reply|automatic reply/i.test(content)) {
    return 'Out of Office';
  }
  
  // Special case for meeting links
  if (/zoom\.us\/|meet\.google\.com/i.test(content)) {
    return 'Meeting Booked';
  }
  
  // Get the category with the highest score
  const maxScore = Math.max(...Object.values(scores));
  const maxCategories = Object.entries(scores)
    .filter(([_, score]) => score === maxScore)
    .map(([category]) => category as EmailCategory);
  
  // If we have a clear winner with score > 0
  if (maxScore > 0 && maxCategories.length === 1) {
    return maxCategories[0];
  }
  
  // If multiple categories have the same score or no matches
  // Prioritize categories in this order
  const priorityOrder: EmailCategory[] = [
    'Spam',
    'Out of Office',
    'Meeting Booked',
    'Interested',
    'Not Interested'
  ];
  
  for (const category of priorityOrder) {
    if (maxCategories.includes(category)) {
      return category;
    }
  }
  
  // Default fallback
  return 'Not Interested';
}