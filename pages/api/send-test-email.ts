import { sendEmail } from 'emails/mailer';
import { NextApiRequest, NextApiResponse } from 'next';

async function sendTestEmail(_req: NextApiRequest, res: NextApiResponse) {
  await sendEmail({
    content: 'content',
    text: 'content',
    to: ['slava.kirshman@gmail.com', 'slava.kirshman@icloud.com'],
    subject: 'subject',
  });

  res.send('Send');
}

export default sendTestEmail;
