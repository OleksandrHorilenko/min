'use client';

import { useState, useEffect } from 'react';
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import useUserStore from "@/stores/useUserStore";
import { updateUserBalance } from '@/app/functions/updateUserBalance';

const WithdrawTab = () => {
  const { user, updateUser } = useUserStore();
  const userBalance = user.ecobalance;
  const userFriendlyAddress = useTonAddress();

  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    // Проверяем локальное хранилище для времени последней транзакции
    const lastWithdrawTime = localStorage.getItem('lastWithdrawTime');
    if (lastWithdrawTime) {
      const now = Date.now();
      const lastTime = parseInt(lastWithdrawTime, 10);
      const timeDifference = now - lastTime;

      if (timeDifference < 5 * 60 * 1000) {
        setIsButtonDisabled(true);
        setRemainingTime(5 * 60 * 1000 - timeDifference);
      }
    }
  }, []);

  useEffect(() => {
    // Таймер для обновления оставшегося времени
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            setIsButtonDisabled(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      if (value.length > 1 && value.startsWith('0')) {
        setError('Number cannot start with zero.');
        return;
      }

      if (value.length > 6) {
        setError('Maximum length is 6 digits.');
        return;
      }

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
    } else {
      setError('Please enter a valid number.');
    }
  };

  const handleWithdraw = async () => {
    const numericAmount = parseInt(amount, 10);

    if (
      !amount ||
      numericAmount < 5000 ||
      numericAmount > 100000 ||
      numericAmount > userBalance
    ) {
      setError('Please enter a valid amount.');
      return;
    }

    try {
      const response = await fetch('/api/userWithdraws', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TelegramId: user.TelegramId,
          wallet: userFriendlyAddress,
          amount: numericAmount,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || 'Error creating withdrawal request');
        return;
      }

      const result = await response.json();

      const newBalance = user.ecobalance - numericAmount;
      updateUser({ ecobalance: newBalance });
      await updateUserBalance(user.TelegramId, numericAmount, "decrement");
      console.log(`Successfully created withdrawal request: ${result.transaction._id}`);
      alert("Withdrawal request submitted successfully.");

      // Сохраняем время последней транзакции в локальное хранилище
      const now = Date.now();
      localStorage.setItem('lastWithdrawTime', now.toString());
      setIsButtonDisabled(true);
      setRemainingTime(5 * 60 * 1000);
    } catch (err) {
      console.error(err);
      setError('Unexpected error occurred. Please try again.');
    }
  };

  const tonEquivalent = amount ? (parseInt(amount, 10) / 1000).toFixed(3) : '0';

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="w-full flex justify-center mt-8">
        <TonConnectButton />
      </div>
      <div className="mt-6 w-full max-w-md p-6 bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg shadow-lg">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Enter Withdrawal Amount
        </label>
        <div className="relative">
          <input
            type="text"
            value={amount}
            onChange={handleInputChange}
            className="w-full p-3 pl-4 pr-12 rounded bg-[#2d2d2e] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="5000 - 100000"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
            <span>{amount ? `${tonEquivalent} TON` : '0 TON'}</span>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={handleWithdraw}
          className="mt-6 w-full shine-effect bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-center gap-3 text-white hover:bg-[#ffffff1a]"
          disabled={isButtonDisabled || !!error || !amount}
        >
          {isButtonDisabled ? `Wait ${Math.ceil(remainingTime / 1000)}s` : 'Withdraw THE'}
        </button>
      </div>
      <p className="mt-4 text-sm text-gray-400">Your balance: {userBalance} coins</p>
    </div>
  );
};

export default WithdrawTab;


