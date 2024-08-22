'use client';

import LoadingIndicator from '@/components/BankAccount/LoadingIndicator';
import Notifications from '@/components/BankAccount/Notification';
import {
  TransactionSummary,
  TransactionSummaryProps,
} from '@/components/BankAccount/TransactionSummary';
import { useToastMutation } from '@/hooks/useToastMutation'; // Adjust path
import axios from 'axios';
import cookie from 'cookie';
import React, { useEffect, useRef, useState } from 'react';

//Add change loading to use react loading and notifcation
const clearCookies = () => {
  // Maybe clear at end of session or dont clear at all just always set at start
  document.cookie = cookie.serialize('organizationId', '', {
    maxAge: -1,
    path: '/',
  });
  //This has to be cleared after every go cardless transaction fetch
  document.cookie = cookie.serialize('requisituionId', '', {
    maxAge: -1,
    path: '/',
  });
};

const fetchTransactionSummary = async () => {
  const response = await axios.get('/api/go-cardless/bank', {
    params: { action: 'transactionsSummary' },
  });
  clearCookies(); // Clear cookies after fetching data
  return response.data;
};

const BankDetailsPage: React.FC = () => {
  const [data, setData] = useState<TransactionSummaryProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rentPrice, setRentPrice] = useState<number>(1000); // Default value if fetching fails
  const [percentage, setPercentage] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [totalSumTransactions, setTotalSumTransactions] = useState<number>(0);
  const hasFetched = useRef(false);

  const mutation = useToastMutation(fetchTransactionSummary, {
    loadingMessage: 'Fetching transaction details...',
    successMessage: (data: TransactionSummaryProps) =>
      'Data fetched successfully!',
    errorMessage: (error: Error) => `Error: ${error.message}`,
    onSuccess: (data) => {
      setData(data);
      clearCookies();
      setLoading(false);
    },
    onError: () => {
      setError('Failed to retreive transaction details');
      clearCookies();
      setLoading(false);
    },
    onSettled: () => {
      setTimeout(() => {
        mutation.reset(); // Clear any lingering notifications after 5 seconds
      }, 5000);
      setLoading(false);
    },
  });

  useEffect(() => {
    if (hasFetched.current) {
      console.log('Already fetched, skipping');
      return;
    }
    hasFetched.current = true;
    setLoading(true);
    mutation.mutate(); // Trigger the fetch on component mount
  }, [mutation]);

  useEffect(() => {
    if (data) {
      const totalSum = data.totalSumTransactions;
      setTotalSumTransactions(totalSum);
    }
  }, [data]);

  /*
  //useEffect for getting rent price
  */

  useEffect(() => {
    if (data) {
      const calculatedPercentage = data.rentAffordabilityPercentage;
      setPercentage(calculatedPercentage);
    }
  }, [data]);

  return (
    <div>
      {loading && <LoadingIndicator />}
      {error && <Notifications message={error} type={'error'} />}
      {data && !loading && (
        <>
          <Notifications
            message={'Data fetched successfully!'}
            type={'success'}
          />
          <TransactionSummary
            totalSumTransactions={totalSumTransactions}
            rentPrice={1000}
            rentAffordabilityPercentage={percentage}
          />
        </>
      )}
    </div>
  );
};

export default BankDetailsPage;
