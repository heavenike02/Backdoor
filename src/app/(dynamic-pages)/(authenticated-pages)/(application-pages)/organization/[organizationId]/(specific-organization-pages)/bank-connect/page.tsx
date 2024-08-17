'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BankAccountConnection from '../../../../../../../../components/BankAccount/BankAccountConnection';
import LoadingIndicator from '../../../../../../../../components/BankAccount/LoadingIndicator';
import Notifications from '../../../../../../../../components/BankAccount/Notification';

interface NotificationsProps {
  message: string;
  type: 'success' | 'error';
}
//TODO: Add bank ui selction
//Add change loading to use react loading and notifcation
const BankLinkPage: React.FC = () => {
  const [link, setLink] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationsProps>({
    message: '',
    type: 'success',
  });

  const handleSuccess = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/go-cardless/bank', {
        params: { action: 'authorize'},
      });
      if (!response.data || !response.data.link) {
        throw new Error('No Bank Link Data');
      }
      setLink(response.data.link);
    } catch (error) {
      setNotification({
        message: 'Error Fetching Bank Link',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (link) {
      window.location.href = link; // Redirect to bank authorization
    }
  }, [link]);

  const handleError = (error: Error) => {
    setNotification({
      message: 'Error connecting bank account',
      type: 'error',
    });
  };

  return (
    <div className="container mx-auto p-4">
      {notification.message && (
        <Notifications
          message={notification.message}
          type={notification.type}
        />
      )}
      {!loading && (
        <BankAccountConnection
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
      {loading && <LoadingIndicator />}
    </div>
  );
};

export default BankLinkPage;
