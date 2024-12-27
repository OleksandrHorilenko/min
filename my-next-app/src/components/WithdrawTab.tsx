'use client';

import { useState } from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';
import useUserStore from "@/stores/useUserStore"; // Предположим, что Zustand хранилище находится здесь

const WithdrawTab = () => {
  const { user } = useUserStore(); // Получаем пользователя из Zustand
  const userBalance = user.ecobalance; // Получаем баланс из состояния

  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\\d*$/.test(value)) {
      setAmount(value);
      setError('');

      const numericValue = parseInt(value, 10);
      if (numericValue < 5000) {
        setError('Minimum withdrawal amount is 5000 coins.');
      } else if (numericValue > 100000) {
        setError('Maximum withdrawal amount is 100000 coins.');
      } else if (numericValue > userBalance) {
        setError('Insufficient balance.');
      }
    }
  };

  const handleWithdraw = () => {
    if (
      !amount ||
      parseInt(amount, 10) < 5000 ||
      parseInt(amount, 10) > 100000 ||
      parseInt(amount, 10) > userBalance
    ) {
      setError('Please enter a valid amount.');
      return;
    }

    // Логика отправки транзакции
    console.log(`Withdrawing ${amount} coins.`);
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="w-full flex justify-center mt-8">
        <TonConnectButton />
      </div>
      <div className="mt-6 w-full max-w-md p-4 bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Enter Withdrawal Amount
        </label>
        <input
          type="text"
          value={amount}
          onChange={handleInputChange}
          className="w-full p-2 rounded bg-[#2d2d2e] text-white focus:outline-none"
          placeholder="5000 - 100000"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={handleWithdraw}
          className="mt-4 w-full shine-effect bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-center gap-3 text-white"
          disabled={!!error || !amount}
        >
          Withdraw THE
        </button>
      </div>
      <p className="mt-4 text-sm text-gray-400">Your balance: {userBalance} coins</p>
    </div>
  );
};

export default WithdrawTab;
