// lib/whaleTransactions.ts

export interface Transaction {
    id: string;
    wallet: string;
    token: string;
    amount: number | string;
    value: number;
    type: string;
    tokenSupply: number | string;
    time: string;
  }
  
  // Simple in-memory store (for demo purposes)
  let transactions: Transaction[] = [];
  
  /**
   * Add a new whale transaction.
   * Prepends the transaction so the latest appears first.
   */
  export const addTransaction = (tx: Transaction): void => {
    transactions.unshift(tx);
    // Limit the stored transactions to 100 for example.
    if (transactions.length > 100) {
      transactions = transactions.slice(0, 100);
    }
  };
  
  /**
   * Get all stored whale transactions.
   */
  export const getTransactions = (): Transaction[] => {
    return transactions;
  };
  

  