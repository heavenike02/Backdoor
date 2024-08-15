'use client';

import LoadingIndicator from '@/components/BankAccount/LoadingIndicator';
import Notifications from '@/components/BankAccount/Notification';
import TransactionSummary from '@/components/BankAccount/TransactionSummary';
import { BankData } from '@/types/bankData';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

//Use ssr rendering to process calculations on the server side instead of the client side
//create transaction type

const BankDetailsPage: React.FC = () => {
  const [data, setData] = useState<BankData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rentPrice, setRentPrice] = useState<number>(1000); // Default value if fetching fails
  const [percentage, setPercentage] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [totalSumTransactions, setTotalSumTransactions] = useState<number>(0);
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (hasFetched.current) {
        console.log('Already fetched, skipping');
        return;
      }
      hasFetched.current = true;

      try {
        const response = await axios.get('/api/go-cardless/bank', {
          params: { action: 'results' },
        });
        const fetchedData = response.data;
        console.log('Fetched Data:', fetchedData);
        setData(fetchedData);
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      console.log('Data:', data);
      const transactions = data.transactions.transactions.booked || [];

      const now = new Date();
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(now.getDate() - 90);

      // Filter transactions from the last 90 days
      const recentTransactions = transactions.filter((transaction: any) => {
        const transactionDate = new Date(transaction.bookingDate);
        return transactionDate >= ninetyDaysAgo;
      });

      const totalSum = recentTransactions.reduce(
        (acc: number, transaction: any) => {
          return acc + parseFloat(transaction.transactionAmount.amount);
        },
        0,
      );

      // Fetch rent price
      //const rentResponse = await axios.get('/api/rent-price');
      //const rentPriceData = rentResponse.data;
      setTotalSumTransactions(totalSum);
    }
  }, [data]);

  useEffect(() => {
    if (totalSumTransactions > 0 && rentPrice > 0) {
      const calculatedPercentage = (totalSumTransactions / rentPrice) * 100;
      setPercentage(calculatedPercentage);
      console.log('Calculated Percentage:', calculatedPercentage);
    }
  }, [totalSumTransactions, rentPrice]);

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
            percentage={percentage} // Adjust this prop as needed
          />
        </>
      )}
    </div>
  );
};

export default BankDetailsPage;
