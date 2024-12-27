import { useState, useEffect } from 'react';
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import useUserStore from "@/stores/useUserStore";

interface Transaction {
  id: string;
  createdAt: string;
  amount: number;
  type: string;
  wallet: string;
}

const TransactionHistory = () => {
  const { user } = useUserStore(); // Получаем информацию о пользователе из хранилища
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (!user?.TelegramId) {
        setError('User TelegramId is missing');
        setLoading(false);
        return;
      }

      try {
        // Передаем TelegramId через параметры URL
        const response = await fetch(`/api/userTransactions?TelegramId=${user.TelegramId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transaction history');
        }

        const data = await response.json();
        setTransactions(data.transactions); // Присваиваем полученные транзакции в состояние
      } catch (err) {
        setError('Error fetching transaction history');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, [user?.TelegramId]); // Запрашиваем только когда TelegramId доступен

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="transaction-history-container">
      <h2 className="text-xl font-semibold text-white-800">Transaction History</h2>
      <div className="mt-4">
        {transactions.length === 0 ? (
          <div className="text-center text-white-800">No transactions found</div>
        ) : (
          transactions.map((transaction) => {
            const transactionDate = new Date(transaction.createdAt).toLocaleString(); // Форматируем дату
            return (
              <div key={transaction.id} className="border-b py-4">
                <div className="text-sm text-white-600">
                  <strong>Date:</strong> {transactionDate}
                </div>
                <div className="text-sm text-white-600">
                  <strong>Amount:</strong> {transaction.amount} THE
                </div>
                <div className="text-sm text-white-600">
                  <strong>Type:</strong> {transaction.type}
                </div>
                <div className="text-sm text-white-600">
                  <strong>Wallet:</strong> {transaction.wallet}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
