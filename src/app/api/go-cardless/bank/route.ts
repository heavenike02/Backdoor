import cookie from 'cookie';
import { randomUUID } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import NordigenClient from 'nordigen-node';
import { getTransactionsSummary } from '../utils';

const secretId = process.env.GOCARDLESS_SECRET_ID ?? '';
const secretKey = process.env.GOCARDLESS_SECRET_KEY ?? '';
const nordigenBaseUrl = process.env.NORDIGEN_BASE_URL ?? '';

const client = new NordigenClient({
  secretId: secretId,
  secretKey: secretKey,
  baseUrl: nordigenBaseUrl,
});

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log('Received request:', req.method, req.query);
  if (req.method === 'GET' && req.query.action === 'authorize') {
    try {
      if (!secretId || !secretKey) {
        throw new Error(
          'GOCARDLESS_SECRET_ID or SECRET_KEY missing in environment.',
        );
      }

      const tokenData = await client.generateToken();
      client.token = tokenData.access;

      //Sandbox test institution id  used for testing at the moment
      const institutionId = 'SANDBOXFINANCE_SFIN0000';
      const init = await client.initSession({
        redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/go-cardless/redirect`,
        institutionId: institutionId,
        referenceId: randomUUID(),
        maxHistoricalDays: 90,
        accessValidForDays: 1,
        userLanguage: 'en',
        ssn: '',
        redirectImmediate: true,
        accountSelection: false,
      });

      res.setHeader(
        'Set-Cookie',
        cookie.serialize('requisitionId', init.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24,
          path: '/',
        }),
      );

      res.status(200).json({ link: init.link });
    } catch (error) {
      console.error('Error in /api/go-cardless/bank:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  } else if (
    req.method === 'GET' &&
    req.query.action === 'transactionsSummary'
  ) {
    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      const requisitionId = cookies.requisitionId;

      if (!requisitionId) {
        throw new Error('Requisition ID is missing. - Cant Access Client');
      }
      console.log('Stored Requisition ID:', requisitionId);

      const requisitionData =
        await client.requisition.getRequisitionById(requisitionId);

      if (!requisitionData.accounts || requisitionData.accounts.length === 0) {
        return res
          .status(400)
          .json({ error: 'No accounts found for this requisitionId' });
      }

      const accountId = requisitionData.accounts[0];
      const account = client.account(accountId);
      console.log('Fetching Bank Account Data:', accountId);

      const [metadata, balances, details, transactions] = await Promise.all([
        account.getMetadata(),
        account.getBalances(),
        account.getDetails(),
        account.getTransactions(),
      ]);

      // Bank Account Data Object
      const bankAccountData = {
        metadata,
        balances,
        details,
        transactions,
      };
      console.log(
        'Bank Account Received:',
        JSON.stringify({ bankAccountData }),
      );

      console.log(
        'Handling Transactions Calculations:',
        bankAccountData.transactions,
      );
      //TODO: add more validation checks
      const transactionSummary = getTransactionsSummary(bankAccountData);
      console.log('Fetched Transactions Calculations:', transactionSummary);

      return res.status(200).json(transactionSummary);
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
