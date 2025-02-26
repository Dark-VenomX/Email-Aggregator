import { Email } from '../types';

export async function sendSlackNotification(email: Email) {
  try {
    const response = await fetch(import.meta.env.VITE_SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🎯 New Interested Lead!',
              emoji: true
            }
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*From:*\n${email.from}`
              },
              {
                type: 'mrkdwn',
                text: `*Subject:*\n${email.subject}`
              }
            ]
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Preview:*\n${email.body.substring(0, 150)}${email.body.length > 150 ? '...' : ''}`
            }
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Slack notification sent successfully');
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
  }
}