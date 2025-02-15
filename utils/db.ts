// Simple in-memory DB for transaction statuses
const transactions: Record<string, string> = {};

// Fetch transaction status from memory
export const getTransactionStatus = (id: string) => {
  return transactions[id] || null;
};

// Save transaction status
export const saveTransactionStatus = (id: string, status: string) => {
  transactions[id] = status;
};

// Get all transactions
export const getAllTransactions = () => {
  return Object.entries(transactions).map(([id, status]) => ({ id, status }));
};
