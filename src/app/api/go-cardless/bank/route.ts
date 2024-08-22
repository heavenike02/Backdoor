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

interface TokenCache {
  accessToken: string | null;
  accessExpiresAt: number | null;
  refreshToken: string | null;
  refreshExpiresAt: number | null;
}

const tokenCache: TokenCache = {
  accessToken: null,
  accessExpiresAt: null,
  refreshToken: null,
  refreshExpiresAt: null,
};

async function getAccessToken(): Promise<string> {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

  // Check if the access token is still valid
  if (
    tokenCache.accessToken &&
    tokenCache.accessExpiresAt &&
    tokenCache.accessExpiresAt > currentTime
  ) {
    return tokenCache.accessToken!;
  }

  // Check if the refresh token is still valid
  if (
    tokenCache.refreshToken &&
    tokenCache.refreshExpiresAt &&
    tokenCache.refreshExpiresAt > currentTime
  ) {
    const newTokenData = await client.exchangeToken({
      refreshToken: tokenCache.refreshToken,
    });

    tokenCache.accessToken = newTokenData.access;
    tokenCache.accessExpiresAt = currentTime + newTokenData.access_expires;
    tokenCache.refreshToken = newTokenData.refresh;
    tokenCache.refreshExpiresAt = currentTime + newTokenData.refresh_expires;

    return tokenCache.accessToken!;
  }

  // If no valid access or refresh token, generate a new token
  const tokenData = await client.generateToken();

  tokenCache.accessToken = tokenData.access;
  tokenCache.accessExpiresAt = currentTime + tokenData.access_expires;
  tokenCache.refreshToken = tokenData.refresh;
  tokenCache.refreshExpiresAt = currentTime + tokenData.refresh_expires;

  return tokenCache.accessToken!;
}

export async function GET(req: NextRequest) {
  console.log('Received request:', req.method, req.nextUrl.searchParams);
  const { searchParams } = new URL(req.url || '');
  const action = searchParams.get('action');

  if (req.method === 'GET' && action === 'institutions') {
    try {
      if (!secretId || !secretKey) {
        throw new Error(
          'GOCARDLESS_SECRET_ID or SECRET_KEY missing in environment.',
        );
      }

      const institutionId = searchParams.get('institutionId') ?? '';
      if (!institutionId) {
        throw new Error('Institution ID is missing.');
      }

      const tokenData = await client.generateToken();
      client.token = tokenData.access;

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
      console.error(
        'Error in /api/go-cardless/bank?action=institutions:',
        error,
      );
      return NextResponse.json(
        {
          success: false,
          message: 'Internal Server Error',
          error: error.message,
        },
        { status: 500 },
      );
    }
  } else if (req.method === 'GET' && action === 'countries') {
    try {
      if (!secretId || !secretKey) {
        throw new Error(
          'GOCARDLESS_SECRET_ID or SECRET_KEY missing in environment.',
        );
      }

      const countryId = searchParams.get('countryId') ?? '';
      if (!countryId) {
        throw new Error('Country ID is missing.');
      }
      console.log('Country ID:', countryId);

      console.log('Fetching Access Token...');
      const tokenData = getAccessToken();
      if (!tokenData) {
        throw new Error('Failed to get access token.');
      }
      console.log('Access Token:', tokenData);

      // Get list of institutions
      const institutions = await client.institution.getInstitutions({
        country: countryId,
      });
      console.log('Institutions:', institutions);

      return NextResponse.json(institutions);
    } catch (error) {
      console.error('Error in /api/go-cardless/bank?action=countries:', error);
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
