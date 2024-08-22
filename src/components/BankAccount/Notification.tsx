import React from 'react';

interface NotificationsProps {
  message: string;
  type: 'success' | 'error';
}

const Notifications: React.FC<NotificationsProps> = ({ message, type }) => {
  const notificationStyles =
    type === 'success'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';

  return (
    <div className={`p-4 mb-4 rounded-md ${notificationStyles}`}>{message}</div>
  );
};

export default Notifications;
