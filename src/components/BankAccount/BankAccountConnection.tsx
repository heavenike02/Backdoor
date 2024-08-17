import React from 'react';


const BankAccountConnection: React.FC<{
  onSuccess: () => void;
  onError: (error: Error) => void;
}> = ({ onSuccess, onError }) => {
  const handleConnect = async () => {
    try {
      await onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className="shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Connect Your Bank Account</h2>
      <button
        onClick={handleConnect}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Connect Bank Account
      </button>
     

    </div>
  );
};

export default BankAccountConnection;
