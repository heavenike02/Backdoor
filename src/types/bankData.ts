export type BankData = {
    metadata: {
        id: string;
        created: string;
        last_accessed: string;
        iban: string;
        institution_id: string;
        status: string;
        owner_name: string;
    };
    balances: {
        balances: {
            balanceAmount: {
                amount: string;
                currency: string;
            };
            balanceType: string;
            referenceDate: string;
        }[];
    };
    details: {
        account: {
            resourceId: string;
            iban: string;
            currency: string;
            ownerName: string;
            name: string;
            product: string;
            cashAccountType: string;
        };
    };
    transactions: {
        transactions: {
            booked: {
                transactionId: string;
                bookingDate: string;
                valueDate: string;
                transactionAmount: {
                    amount: string;
                    currency: string;
                };
                remittanceInformationUnstructured: string;
                bankTransactionCode: string;
                debtorName?: string;
                debtorAccount?: {
                    iban: string;
                };
            }[];
            pending: {
                valueDate: string;
                transactionAmount: {
                    amount: string;
                    currency: string;
                };
                remittanceInformationUnstructured: string;
            }[];
        };
    };
};
