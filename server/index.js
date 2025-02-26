import express from 'express';
import cors from 'cors';
import { Client } from '@elastic/elasticsearch';
import Imap from 'node-imap';
import { simpleParser } from 'mailparser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Elasticsearch client
const esClient = new Client({
  node: 'http://localhost:9200'
});

// Email accounts configuration
const emailAccounts = [
  {
    user: process.env.EMAIL_1,
    password: process.env.PASSWORD_1,
    host: process.env.IMAP_HOST_1,
    port: 993,
    tls: true
  },
  {
    user: process.env.EMAIL_2,
    password: process.env.PASSWORD_2,
    host: process.env.IMAP_HOST_2,
    port: 993,
    tls: true
  }
];

// AI categorization patterns
const categoryPatterns = {
  Interested: /(interested|would like to proceed|next steps|looking forward)/i,
  'Meeting Booked': /(scheduled|appointment|meeting confirmed|calendar invite)/i,
  'Not Interested': /(not a good fit|unfortunately|not moving forward|not interested)/i,
  Spam: /(viagra|lottery|prince|won|inheritance|cryptocurrency)/i,
  'Out of Office': /(out of office|vacation|holiday|away from|auto-reply)/i
};

// Categorize email using patterns
function categorizeEmail(email) {
  const textToAnalyze = `${email.subject} ${email.body}`.toLowerCase();
  
  for (const [category, pattern] of Object.entries(categoryPatterns)) {
    if (pattern.test(textToAnalyze)) {
      return category;
    }
  }
  
  return 'Uncategorized';
}

// Send webhook for interested leads
async function sendWebhook(email) {
  try {
    await fetch('https://webhook.site/token/your-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'interested_lead',
        email: {
          from: email.from,
          subject: email.subject,
          category: 'Interested'
        }
      })
    });
  } catch (error) {
    console.error('Webhook error:', error);
  }
}

// Send Slack notification
async function sendSlackNotification(email) {
  try {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `New Interested Lead!\nFrom: ${email.from}\nSubject: ${email.subject}`
      })
    });
  } catch (error) {
    console.error('Slack notification error:', error);
  }
}

// Connect to IMAP and listen for new emails
function connectImap(account) {
  const imap = new Imap(account);

  imap.once('ready', () => {
    imap.openBox('INBOX', false, (err, box) => {
      if (err) throw err;

      // Listen for new emails
      imap.on('mail', async () => {
        const fetch = imap.seq.fetch('*', {
          bodies: ['HEADER', 'TEXT'],
          struct: true
        });

        fetch.on('message', async (msg) => {
          const email = await simpleParser(msg);
          const category = categorizeEmail(email);

          // Index in Elasticsearch
          await esClient.index({
            index: 'emails',
            document: {
              from: email.from,
              subject: email.subject,
              body: email.text,
              date: email.date,
              category,
              account: account.user
            }
          });

          if (category === 'Interested') {
            await sendWebhook(email);
            await sendSlackNotification(email);
          }
        });
      });
    });
  });

  imap.connect();
}

// Connect to all email accounts
emailAccounts.forEach(connectImap);

// API endpoints
app.get('/api/emails', async (req, res) => {
  try {
    const { searchTerm, account, folder } = req.query;

    const query = {
      bool: {
        must: [
          searchTerm ? {
            multi_match: {
              query: searchTerm,
              fields: ['subject', 'body']
            }
          } : { match_all: {} }
        ],
        filter: [
          account ? { term: { account } } : null,
          folder ? { term: { folder } } : null
        ].filter(Boolean)
      }
    };

    const result = await esClient.search({
      index: 'emails',
      query
    });

    res.json(result.hits.hits.map(hit => hit._source));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});