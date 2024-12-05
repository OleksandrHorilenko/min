import React, { useState } from "react";
import { TonConnectButton, useTonConnectUI, SendTransactionRequest } from '@tonconnect/ui-react';

const DepositForm = () => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  // Использование хука для TON Connect
  const [tonConnectUI] = useTonConnectUI();

  // Функция для установки процентов
  const setPercentage = (percentage: number) => {
    const calculatedAmount = (10000 * percentage) / 100;

    // Убедимся, что вычисленное значение корректно
    if (calculatedAmount > 0 && calculatedAmount <= 10000) {
      setAmount(String(calculatedAmount));
      setError(""); // Убираем ошибку, если данные корректны
    } else {
      setError("Percentage calculation resulted in an invalid amount");
    }
  };

  // Функция для проверки ввода
  const validateAmount = (value: string) => {
    const parsed = parseFloat(value);

    // Проверка на положительные числа в допустимом диапазоне
    if (!parsed || parsed <= 0 || parsed > 10000) {
      setError("Enter a valid amount (0.001 - 10,000)");
      return false;
    }

    setError("");
    return true;
  };

  // Обработка транзакции
  const verifyTransaction = () => {
    if (!validateAmount(amount)) return;
    console.log("Verifying transaction...");
  };

  // Тело транзакции
  const transaction: SendTransactionRequest = {
    validUntil: Date.now() + 5 * 60 * 1000, // 5 минут
    messages: [
      {
        address: "UQAK-eku1yCNkL5wt7g9OlBpHSnjadN10h_A19uM3SGVJIu2", // адрес получателя
        amount: (parseFloat(amount) * 1e9).toString(), // конвертация в нанотоны
      },
    ],
  };

  const isBuyButtonDisabled = () => {
    const parsed = parseFloat(amount);
    return !(parsed > 0.001 && parsed <= 10000);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 text-white rounded-lg shadow-lg p-6 mt-8">
      <div className="flex justify-between mb-4">
        <button className="text-sm font-medium text-blue-500 border-b-2 border-blue-500 pb-1">
          Deposit
        </button>
        <button className="text-sm font-medium text-gray-400">History</button>
      </div>

      <h2 className="text-xl font-semibold mb-4">App balance top-up</h2>

      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium">
          Amount
        </label>
        <div className="relative mt-2 flex items-center">
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => {
              const inputValue = e.target.value;

              // Проверяем, что вводится только положительное число
              if (!/^\d*\.?\d*$/.test(inputValue)) {
                setError("Only positive numbers are allowed");
                return;
              }

              setAmount(inputValue);
              validateAmount(inputValue);
            }}
            placeholder="0"
            className="p-3 w-full bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute right-2 flex gap-2">
            <button
              onClick={() => setPercentage(25)}
              className="px-2 py-1 text-sm text-gray-400 bg-gray-700 rounded"
            >
              25%
            </button>
            <button
              onClick={() => setPercentage(50)}
              className="px-2 py-1 text-sm text-gray-400 bg-gray-700 rounded"
            >
              50%
            </button>
            <button
              onClick={() => setPercentage(100)}
              className="px-2 py-1 text-sm text-gray-400 bg-gray-700 rounded"
            >
              100%
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="flex gap-4 mb-6">
        <TonConnectButton />
      </div>

      <div className="flex gap-2">
        <button
          className={`w-[65%] px-4 py-2 font-semibold rounded-lg shadow ${
            isBuyButtonDisabled()
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
          }`}
          onClick={() => tonConnectUI.sendTransaction(transaction)}
          disabled={isBuyButtonDisabled()}
        >
          Buy $ECO
        </button>
        <button
          onClick={verifyTransaction}
          className="w-[30%] px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
        >
          Verify
        </button>
      </div>

      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-blue-400">ℹ️</span>
          <p className="text-sm text-gray-400">
            After completing a successful transaction in your wallet, wait a
            couple of minutes and then click the "Verify Transaction" button to
            update your balance in the app.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepositForm;
