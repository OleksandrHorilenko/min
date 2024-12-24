"use client";
import { beginCell, toNano, Address } from '@ton/ton'
import React, { useState, useEffect } from "react";
import { TonConnectButton, useTonConnectUI, SendTransactionRequest,useTonWallet, useTonAddress } from "@tonconnect/ui-react";
import useUserStore from "@/stores/useUserStore";
import { Section, Cell, Info, Avatar } from "@telegram-apps/telegram-ui";
//import { TonConnectButton, useTonConnectUI, useTonWallet, useTonAddress } from '@tonconnect/ui-react';

const DepositTab = () => {
  const [tonAmount, setTonAmount] = useState("");
  const [tonError, setTonError] = useState("");
  const [jettonAmount, setJettonAmount] = useState("");
  const [jettonError, setJettonError] = useState("");
  const { user, updateUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [tonConnectUI] = useTonConnectUI();

  //test jetton transaction
const userFriendlyAddress = useTonAddress(); // Адрес текущего пользователя
const jettonContractAddress = "EQBaURJRjn-hG-1ilKdyBaAsxnch35LZ3BquysFnkVaHUc1P"; 
const Wallet_DST = "UQAK-eku1yCNkL5wt7g9OlBpHSnjadN10h_A19uM3SGVJIu2";
const Wallet_SRC = userFriendlyAddress;
const [walletBalance, setWalletBalance] = useState<any | null>(null);
const wallet = useTonWallet();
const address = wallet?.account?.address; 
// Формируем тело сообщения
//const body = beginCell()
//    .storeUint(0xf8a7ea5, 32)                 // Jetton transfer op code
//    .storeUint(0, 64)                         // query_id:uint64
 //   .storeCoins(toNano("1.5"))                // Jetton amount for transfer (1.5 Jettons)
//    .storeAddress(Address.parse(Wallet_DST))  // Адрес получателя
//    .storeAddress(Address.parse(Wallet_SRC))  // Адрес отправителя (для ответного сообщения)
//    .storeUint(0, 1)                          // custom_payload
//    .storeCoins(toNano("0.05"))               // Количество TON для комиссии/уведомления
//    .storeUint(0, 1)                          // forward_payload
//    .endCell();

//console.log("Transaction body:", body);

//баланс токена
useEffect(() => {
  const url = `https://toncenter.com/api/v2/getAddressInformation?address=${address}`;
  if (address) {
    fetch(url)
      .then(async (response: any) => {
        const res = await response.json();
        console.log(res);
        setWalletBalance(parseFloat(res.result.balance) / 1e9);
      })
      .catch((error) => console.error(error));
  }
}, [address]);

  ///Пополнение TON

  const validateTonAmount = (value: string) => {
    const parsed = parseFloat(value);
    if (!parsed || parsed <= 0 || parsed > 10000) {
      setTonError("Enter a valid TON amount (0.01 - 10,000)");
      return false;
    }
    setTonError("");
    return true;
  };

  const handleTonInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^\d{0,5}(\.\d{0,2})?$/.test(inputValue) || inputValue === "") {
      setTonAmount(inputValue);
      validateTonAmount(inputValue);
    } else {
      setTonError("Only valid number input is allowed");
    }
  };

  const isTonButtonDisabled = () => {
    const parsed = parseFloat(tonAmount);
    return !(parsed > 0.001 && parsed <= 10000);
  };

  const handleTonTransaction = async () => {
    try {
      setIsLoading(true);
      const transaction: SendTransactionRequest = {
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
          {
            address: "UQAK-eku1yCNkL5wt7g9OlBpHSnjadN10h_A19uM3SGVJIu2",
            amount: (parseFloat(tonAmount) * 1e9).toString(),
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);

      if (result) {
        const coinsToAdd = parseFloat(tonAmount) * 1000;
        await updateBalanceInDB(coinsToAdd);
        setTonAmount("");
      } else {
        alert("TON transaction failed or was cancelled.");
      }
    } catch (error) {
      console.error("TON transaction error:", error);
      alert("TON transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  ///Пополнение Jetton

  const validateJettonAmount = (value: string) => {
    const parsed = parseFloat(value);
    if (!parsed || parsed <= 0 || parsed > 10000) {
      setJettonError("Enter a valid Jetton amount (0.01 - 10,000)");
      return false;
    }
    setJettonError("");
    return true;
  };

  const handleJettonInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^\d{0,5}(\.\d{0,2})?$/.test(inputValue) || inputValue === "") {
      setJettonAmount(inputValue);
      validateJettonAmount(inputValue);
    } else {
      setJettonError("Only valid number input is allowed");
    }
  };

  const isJettonButtonDisabled = () => {
    const parsed = parseFloat(jettonAmount);
    return !(parsed > 0.001 && parsed <= 10000);
  };

  const handleJettonTransaction = async () => {
    try {
      setIsLoading(true);
  
      
  
      
  
      //const Wallet_DST = "UQAK-eku1yCNkL5wt7g9OlBpHSnjadN10h_A19uM3SGVJIu2"; // Адрес получателя
      //const Wallet_SRC = userFriendlyAddress; // Адрес отправителя
  
      // Проверка суммы
      const estimatedFee = 0.1; // Примерная комиссия
      const totalAmount = parseFloat(jettonAmount) - estimatedFee;
  
      if (totalAmount <= 0) {
        alert("The amount is too small after deducting the transaction fee.");
        return;
      }
  
      // Формируем тело транзакции
      const body = beginCell()
        .storeUint(0xf8a7ea5, 32) // Jetton transfer op code
        .storeUint(0, 64) // query_id:uint64
        .storeCoins(toNano(totalAmount.toString())) // Сумма жетонов для перевода (в nano)
        .storeAddress(Address.parse(Wallet_DST)) // Адрес получателя
        .storeAddress(Address.parse(Wallet_SRC)) // Адрес отправителя (для ответного сообщения)
        .storeUint(0, 1) // custom_payload
        .storeCoins(toNano("0.05")) // Количество TON для комиссии/уведомления
        .storeUint(0, 1) // forward_payload
        .endCell();
  
      console.log("Transaction body:", body);
  
      // Описание транзакции
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300, // Время валидности
        messages: [
          {
            address: jettonContractAddress, // Адрес контракта жетона
            amount: toNano("0.15").toString(), 
            payload: body.toBoc().toString("base64"), 
          },
        ],
      };
  
      // Отправляем транзакцию
      const result = await tonConnectUI.sendTransaction(transaction);
  
      if (result) {
        alert("Transaction successful!");
        const coinsToAdd = totalAmount * 1000; // Перерасчет суммы с учетом комиссии
        await updateBalanceInDB(coinsToAdd);
        setJettonAmount(""); // Сброс введенной суммы
      } else {
        alert("Jetton transaction failed or was cancelled.");
      }
    } catch (error) {
      console.error("Jetton transaction error:", error);
      alert("An error occurred during the transaction. Please try again.");
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

  return (
    <div className="max-w-md mx-auto bg-gray-900 text-white rounded-lg shadow-lg p-6 mt-8"><div className="mb-4">
    {/* Connect Wallet Button */}
    <TonConnectButton />
    {JSON.stringify(walletBalance)} {walletBalance}
  </div>
     
    
    
      <div className="flex justify-between mb-4">
        <button className="text-sm font-medium text-blue-500 border-b-2 border-blue-500 pb-1">
          Deposit
        </button>
        <button className="text-sm font-medium text-gray-400">History</button>
      </div>

      <h2 className="text-xl font-semibold mb-4">App balance top-up</h2>

      {/* TON Amount Input */}
      <div className="mb-6">
        <label htmlFor="tonAmount" className="block text-sm font-medium">
          TON Amount
        </label>
        <input
          id="tonAmount"
          type="text"
          value={tonAmount}
          onChange={handleTonInputChange}
          placeholder="Enter TON amount"
          className="p-3 w-full bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {tonError && <p className="text-red-500 text-sm mt-2">{tonError}</p>}
        <button
          className={`mt-4 w-full px-4 py-2 font-semibold rounded-lg shadow ${
            isTonButtonDisabled()
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
          }`}
          onClick={handleTonTransaction}
          disabled={isTonButtonDisabled()}
        >
          Top up with TON
        </button>
      </div>

      {/* Jetton Amount Input */}
      <div className="mb-6">
        <label htmlFor="jettonAmount" className="block text-sm font-medium">
          Jetton Amount
        </label>
        <input
          id="jettonAmount"
          type="text"
          value={jettonAmount}
          onChange={handleJettonInputChange}
          placeholder="Enter Jetton amount"
          className="p-3 w-full bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {jettonError && <p className="text-red-500 text-sm mt-2">{jettonError}</p>}
        <button
          className={`mt-4 w-full px-4 py-2 font-semibold rounded-lg shadow ${
            isJettonButtonDisabled()
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-green-500 text-gray-900 hover:bg-green-600"
          }`}
          onClick={handleJettonTransaction}
          disabled={isJettonButtonDisabled()}
        >
          Top up with Jetton
        </button>
      </div>

      {successMessage && <p className="text-green-500 text-sm mt-4">{successMessage}</p>}
    </div>
  );
};

export default DepositTab;

