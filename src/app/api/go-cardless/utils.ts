import { BankAccountType, BookedTransaction } from '@/types/bankAccountType';
//Transcation Methods TODO: Move to a separate file for business logic and better readbility
function getTransactionsSummary(bankAccountData: BankAccountType) {
  const totalSumTransactions = handleTransactionSumCalculation(
    bankAccountData.transactions.transactions.booked,
  );
  const rentPrice = 1000; //Has to be updated with the actual rent price
  const rentAffordabilityPercentage = handleRentAffordabiltyCheck(
    totalSumTransactions,
    rentPrice,
  );

  const calulatedTransactionsSummary = {
    totalSumTransactions,
    rentPrice,
    rentAffordabilityPercentage,
  };

  return calulatedTransactionsSummary;
}

function handleTransactionSumCalculation(
  bookedTransactions: BookedTransaction[],
) {
  //Calculate the date 90 days ago
  const now = new Date();
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(now.getDate() - 90);

  // Filter transactions from the last 90 days
  const recentTransactions = bookedTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.bookingDate);
    return transactionDate >= ninetyDaysAgo;
  });

  // Calculate the total sum of the transactions
  const totalSum = recentTransactions.reduce(
    (acc: number, transaction: BookedTransaction) => {
      return acc + parseFloat(transaction.transactionAmount.amount);
    },
    0,
  );
  console.log('Total Sum:', totalSum);
  return totalSum;
}

function handleRentAffordabiltyCheck(
  totalSumTransactions: number,
  rentPrice: number,
) {
  //Check if the total sum of transactions and rent price is greater than 0
  if (totalSumTransactions > 0 && rentPrice > 0) {
    //Calculate the percentage of the total sum of transactions to the rent price
    const calculatedPercentage = (totalSumTransactions / rentPrice) * 100;
    console.log('Calculated Percentage:', calculatedPercentage);
    return calculatedPercentage;
  }
  console.log(
    'Total Sum Transactions or Rent Price were is not greater than 0',
    totalSumTransactions,
  );
}

export { getTransactionsSummary };
