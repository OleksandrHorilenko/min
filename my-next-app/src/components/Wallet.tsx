'use client';

import { useEffect, useState } from 'react';

interface WalletData {
  balance: number;
  currency: string;
}

export default function Wallet() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Получение данных кошелька с сервера
   // fetch('/api/wallet')
   //   .then((response) => response.json())
   //   .then((data) => {
   //     if (data.error) {
   //       setError(data.error);
   //     } else {
   //       setWalletData(data);
   //     }
   //   })
   //   .catch(() => setError('Не удалось загрузить данные кошелька'));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Кошелек</h2>
      {error && <p className="text-red-500">{error}</p>}
      {walletData ? (
        <div>
          <p>Баланс: {walletData.balance} {walletData.currency}</p>
        </div>
      ) : (
        <p>Загрузка данных...</p>
      )}
    </div>
  );
}