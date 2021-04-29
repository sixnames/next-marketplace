import { sendOrderCreatedEmail } from 'emails/orderCreatedEmail';
import { NextApiRequest, NextApiResponse } from 'next';

async function sendTestEmail(_req: NextApiRequest, res: NextApiResponse) {
  await sendOrderCreatedEmail({
    to: 'slava.kirshman@gmail.com',
    userName: 'Slava',
    orderItemId: '879822',
  });

  res.send('Send');
}

export default sendTestEmail;
