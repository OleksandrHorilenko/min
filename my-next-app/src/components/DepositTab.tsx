'use client';

import React, { useState } from "react";
import { TonConnectButton, useTonConnectUI, SendTransactionRequest } from "@tonconnect/ui-react";
import useUserStore from "@/stores/useUserStore";

const DepositTab = () => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const { user, updateUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [tonConnectUI] = useTonConnectUI();

  const setPercentage = (percentage: number) => {
    const calculatedAmount = (100 * percentage) / 100;
    if (calculatedAmount > 0 && calculatedAmount <= 10000) {
      setAmount(String(calculatedAmount));
      setError("");
    } else {
      setError("Percentage calculation resulted in an invalid amount");
    }
  };

  const validateAmount = (value: string) => {
    const parsed = parseFloat(value);
    if (!parsed || parsed <= 0 || parsed > 10000) {
      setError("Enter a valid amount (0.01 - 10,000)");
      return false;
    }
    setError("");
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^\d{0,5}(\.\d{0,2})?$/.test(inputValue) || inputValue === "") {
      setAmount(inputValue);
      validateAmount(inputValue);
    } else {
      setError("Only valid number input is allowed");
    }
  };

  const isBuyButtonDisabled = () => {
    const parsed = parseFloat(amount);
    return !(parsed > 0.001 && parsed <= 10000);
  };

  const updateBalanceInDB = async (coinsToAdd: number) => {
    try {
      const response = await fetch("/api/updateUserBalance", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          TelegramId: user.TelegramId, // TelegramId текущего пользователя
          ecobalance: coinsToAdd,
          action: "increment"
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
      setError("Failed to update balance in the database.");
    }
  };

  const handleTransactionSuccess = async () => {
    try {
      setIsLoading(true);
      const transaction: SendTransactionRequest = {
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
          {
            address: "UQAK-eku1yCNkL5wt7g9OlBpHSnjadN10h_A19uM3SGVJIu2",
            amount: (parseFloat(amount) * 1e9).toString(),
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);

      if (result) {
        const coinsToAdd = parseFloat(amount) * 100;
        await updateBalanceInDB(coinsToAdd);
        setAmount("");
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

  const multipliedAmount = amount ? (parseFloat(amount) * 100).toFixed(2) : "0.00";

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
            type="text"
            value={amount}
            onChange={handleInputChange}
            placeholder="0"
            className="p-3 w-full bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute right-2 flex gap-2">
            <button
              onClick={() => setPercentage(25)}
              className="px-2 py-1 text-sm text-gray-400 bg-gray-700 rounded"
            >
              25TON
            </button>
            <button
              onClick={() => setPercentage(50)}
              className="px-2 py-1 text-sm text-gray-400 bg-gray-700 rounded"
            >
              50TON
            </button>
            <button
              onClick={() => setPercentage(100)}
              className="px-2 py-1 text-sm text-gray-400 bg-gray-700 rounded"
            >
              100TON
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
      <div className="text-sm text-gray-400 mt-2">
        {amount ? `$ECO = ${multipliedAmount}` : "Enter an amount to see result"}
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
          onClick={handleTransactionSuccess}
          disabled={isBuyButtonDisabled()}
        >
          Buy $ECO
        </button>
      </div>
    </div>
  );
};

export default DepositTab;
