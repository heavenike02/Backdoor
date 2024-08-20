import React from 'react';

export interface TransactionSummaryProps {
  totalSumTransactions: number;
  rentPrice: number;
  rentAffordabilityPercentage: number;
}

export const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  totalSumTransactions,
  rentPrice,
  rentAffordabilityPercentage,
}) => {
  return (
    <div className=" shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Transaction Summary</h2>
      <table className="w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-500">
            <th className="border border-gray-300 p-2 text-left">Item</th>
            <th className="border border-gray-300 p-2 text-left">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2">
              Total Sum of Transactions
            </td>
            <td className="border border-gray-300 p-2">
              ${totalSumTransactions.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">Rent Price</td>
            <td className="border border-gray-300 p-2">
              ${rentPrice.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">
              Rent Affordability Percentage
            </td>
            <td className="border border-gray-300 p-2">
              {rentAffordabilityPercentage.toFixed(2)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TransactionSummary;
