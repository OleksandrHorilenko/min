"use client";
import { beginCell, toNano, Address } from '@ton/ton';
import React, { useState, useEffect } from "react";
import { TonConnectButton, useTonConnectUI, SendTransactionRequest, useTonWallet, useTonAddress } from "@tonconnect/ui-react";
import useUserStore from "@/stores/useUserStore";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";

interface TransactionData {
  userId: string; // TelegramId пользователя
  wallet: any | null;
  amount: number;  // Сумма транзакции
  transactionType: string; // Тип транзакции, например, "deposit"
  timestamp: string; // Время транзакции в формате ISO
}

const DepositTab = () => {
  const [tonAmount, setTonAmount] = useState("");
  const [tonError, setTonError] = useState("");
  const [jettonAmount, setJettonAmount] = useState("");
  const [jettonError, setJettonError] = useState("");
  const { user, updateUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [tonConnectUI] = useTonConnectUI();
  const [tokenAmount, setTokenAmount] = useState(""); // Для ввода количества токенов

  // Получаем адрес пользователя
  const userFriendlyAddress = useTonAddress(); // Адрес текущего пользователя
  const wallet = useTonWallet();
  const address = wallet?.account?.address;

  const TOKENS_PER_TON = 1000; // 1 TON = 1000 токенов

  const handleQuickFill = (amount: number) => {
    const tokenString = amount.toString();
    setTokenAmount(tokenString);
    const calculatedTon = amount / TOKENS_PER_TON;
    setTonAmount(calculatedTon.toFixed(6));
    setTonError("");
  };

  const validateTokenAmount = (value: string) => {
    const parsed = parseFloat(value);
    if (!parsed || parsed <= 0 || parsed > 10000000) { // Максимум 10,000,000 токенов (10,000 TON)
      setTonError("Enter a valid token amount (1 - 10,000,000)");
      return false;
    }
    setTonError("");
    return true;
  };

  const handleTokenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^\d{0,7}(\.\d{0,2})?$/.test(inputValue) || inputValue === "") {
      setTokenAmount(inputValue);
      if (validateTokenAmount(inputValue)) {
        const calculatedTon = parseFloat(inputValue) / TOKENS_PER_TON;
        setTonAmount(calculatedTon.toFixed(6)); // Отображать до 6 знаков после запятой
      } else {
        setTonAmount("");
      }
    } else {
      setTonError("Only valid number input is allowed");
    }
  };

  const isTokenButtonDisabled = () => {
    const parsed = parseFloat(tokenAmount);
    return !(parsed > 0 && parsed <= 10000000);
  };

  const handleTokenTransaction = async () => {
    try {
      setIsLoading(true);
      const tonAmountToSend = parseFloat(tonAmount);

      const transaction: SendTransactionRequest = {
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
          {
            address: "UQAK-eku1yCNkL5wt7g9OlBpHSnjadN10h_A19uM3SGVJIu2", // Пример адреса
            amount: (tonAmountToSend * 1e9).toString(), // Перевод в нанотоны
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);

      if (result) {
        const coinsToAdd = parseFloat(tokenAmount); // Добавляем токены
        await updateBalanceInDB(coinsToAdd);
        // Логирование транзакции в базу данных
        const transactionData: TransactionData = {
          userId: user.TelegramId,
          wallet: userFriendlyAddress,
          amount: coinsToAdd,
          transactionType: "deposit", // Тип транзакции (например, депозит)
          timestamp: new Date().toISOString(),
        };
        await logTransactionInDB(transactionData);

        setTokenAmount("");
        setTonAmount("");
      } else {
        alert("Transaction failed or was cancelled.");
      }
    } catch (error) {
      console.error("Transaction error:", error);
      alert("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateBalanceInDB = async (coinsToAdd: number) => {
    try {
      const response = await fetch("/api/updateUserBalance", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          TelegramId: user.TelegramId,
          ecobalance: coinsToAdd,
          action: "increment",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update balance in the database.");
      }

      const updatedUser = await response.json();
      updateUser({ ecobalance: updatedUser.ecobalance });
      setSuccessMessage(`Successfully added ${coinsToAdd} $ECO to your balance!`);
    } catch (err) {
      console.error("Error updating balance in the database:", err);
      setTonError("Failed to update balance in the database.");
    }
  };

  // Запись транзакции в базу данных
  const logTransactionInDB = async (transactionData: TransactionData) => {
    try {
      const response = await fetch("/api/userTransactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          TelegramId: transactionData.userId,
          wallet: transactionData.wallet, // Передаем wallet в нужном типе
          amount: transactionData.amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to log transaction.");
      }
    } catch (err) {
      console.error("Error logging transaction:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 text-white rounded-lg shadow-lg p-6 mt-8">
      <div className="mb-4">
        <TonConnectButton />
      </div>

      <div className="flex justify-between mb-4">
        <button className="text-sm font-medium text-blue-500 border-b-2 border-blue-500 pb-1">
          Deposit
        </button>
        <button className="text-sm font-medium text-gray-400">History</button>
      </div>

      <h2 className="text-xl font-semibold mb-4">App balance top-up</h2>

      <div className="mb-6">
        <label htmlFor="tokenAmount" className="block text-sm font-medium">
          Enter Token Amount
        </label>
        <input
          id="tokenAmount"
          type="text"
          value={tokenAmount}
          onChange={handleTokenInputChange}
          placeholder="Enter token amount"
          className="p-3 w-full bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {tonError && <p className="text-red-500 text-sm mt-2">{tonError}</p>}
        <p className="mt-2 text-gray-300">You will pay: {tonAmount || "0"} TON</p>

        <div className="mt-4 flex gap-2">
          {[1000, 5000, 10000].map((amount) => (
            <button
              key={amount}
              className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 focus:outline-none"
              onClick={() => handleQuickFill(amount)}
            >
              +{amount}
            </button>
          ))}
        </div>

        <button
          className={`mt-6 w-full px-4 py-2 font-semibold rounded-lg shadow ${
            isTokenButtonDisabled()
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-green-500 text-gray-900 hover:bg-green-600"
          }`}
          onClick={handleTokenTransaction}
          disabled={isTokenButtonDisabled()}
        >
          Buy Tokens
        </button>
      </div>

      {isLoading && <p className="text-gray-400 text-sm mt-4">Processing transaction...</p>}
    </div>
  );
};

export default DepositTab;

