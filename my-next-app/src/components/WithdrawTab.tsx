'use client';

import { useState } from 'react';
import { TonConnectButton, useTonConnectUI, SendTransactionRequest, useTonWallet, useTonAddress } from "@tonconnect/ui-react";
import useUserStore from "@/stores/useUserStore"; // Предположим, что Zustand хранилище находится здесь

const WithdrawTab = () => {
  const { user } = useUserStore(); // Получаем пользователя из Zustand
  const userBalance = user.ecobalance; // Получаем баланс из состояния
  const userFriendlyAddress = useTonAddress();

  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Проверка, что ввод состоит только из цифр
    if (/^\d*$/.test(value)) {
      // Проверка, чтобы первое число не было 0
      if (value.length > 1 && value.startsWith('0')) {
        setError('Number cannot start with zero.');
        return;
      }

      // Ограничение длины вводимого значения (например, до 6 символов)
      if (value.length > 6) {
        setError('Maximum length is 6 digits.');
        return;
      }

      setAmount(value);
      setError('');

      const numericValue = parseInt(value, 10);

      // Логика для проверки минимальной и максимальной суммы
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
  
    // Проверка корректности суммы для вывода
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
      // Отправка заявки на вывод
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TelegramId: user.TelegramId, // Идентификатор Telegram пользователя
          wallet: userFriendlyAddress, // Адрес кошелька пользователя
          amount: numericAmount, // Сумма для вывода
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Уведомление об успешной отправке заявки
        console.log(`Successfully created withdrawal request: ${result.transaction._id}`);
        alert("Withdrawal request submitted successfully.");
      } else {
        // Отображение ошибки, если запрос не успешен
        setError(result.error || 'Error creating withdrawal request');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };
  

  // Расчет эквивалента в TON
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


