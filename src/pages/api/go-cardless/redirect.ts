import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('Received request:', req.method, req.query);
  if (req.method === 'GET') {
    const cookies = cookie.parse(req.headers.cookie || '');
    const organizationId = cookies.organizationId;
    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is missing' });
    }
    try {
      if (!req.query.ref) {
        throw new Error('Ref ID is missing. - No Bank Authorization');
      }
      console.log('Received Reference ID:', req.query.ref);
      res.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/organization/${organizationId}/bank-details`,
      );
    } catch (error) {
      console.error('Error in fetching bank account data:', {
        message: error.message,
        stack: error.stack,
        response: error.response ? error.response.data : 'No response data',
      });
      res.status(500).json({ error: 'Failed to fetch bank account data' });
    }
  }
}
