import cookie from 'cookie';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(req: NextRequest) {
  console.log('Received request:', req.method, req.nextUrl.searchParams);
  const { searchParams } = new URL(req.url || '');
  const action = searchParams.get('action');

  if (req.method === 'GET' && action === 'authorize') {
    try {
      if (!secretId || !secretKey) {
        throw new Error(
          'GOCARDLESS_SECRET_ID or SECRET_KEY missing in environment.',
        );
      }

      const tokenData = await client.generateToken();
      client.token = tokenData.access;

      const institutionId = searchParams.get('institutionId') ?? '';
      if (!institutionId) {
        throw new Error('Institution ID is missing.');
      }

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

      const response = NextResponse.json({ link: init.link });

      response.headers.set(
        'Set-Cookie',
        cookie.serialize('requisitionId', init.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24,
          path: '/',
        }),
      );

      return response;
    } catch (error) {
      console.error('Error in /api/go-cardless/bank?action=authorize:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Internal Server Error',
          error: error.message,
        },
        { status: 500 },
      );
    }
  } else if (req.method === 'GET' && action === 'transactionsSummary') {
    try {
      const cookies = cookie.parse(req.headers.get('cookie') || '');
      const requisitionId = cookies.requisitionId;

      if (!requisitionId) {
        throw new Error('Requisition ID is missing. - Cant Access Client');
      }
      console.log('Stored Requisition ID:', requisitionId);

      const requisitionData =
        await client.requisition.getRequisitionById(requisitionId);

      if (!requisitionData.accounts || requisitionData.accounts.length === 0) {
        return NextResponse.json(
          { error: 'No accounts found for this requisitionId' },
          { status: 400 },
        );
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

      return NextResponse.json(transactionSummary, { status: 200 });
    } catch (error) {
      console.error('Error in fetching bank account data:', {
        message: error.message,
        stack: error.stack,
        response: error.response ? error.response.data : 'No response data',
      });
      return NextResponse.json(
        { error: 'Failed to fetch bank account data' },
        { status: 500 },
      );
    }
  }
}

// Default handler for unsupported methods
export function handler(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json(
      { message: 'Method Not Allowed' },
      { status: 405 },
    );
  }
}
