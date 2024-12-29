'use client';

import React, { useEffect, useState } from 'react';
import DepositTab from './DepositTab';
import WithdrawTab from './WithdrawTab';
import TransactionHistory from './TransactionHistory';
import Image from 'next/image';
import { sun } from '@/images'; // Импортируем изображение солнца
import { TonConnectButton, useTonConnectUI, useTonWallet, useTonAddress } from '@tonconnect/ui-react';
import useUserStore from '@/stores/useUserStore'; // Подключаем хранилище пользователя
import { IoPaperPlaneOutline } from "react-icons/io5";

const Wallet = () => {
  const [selectedTab, setSelectedTab] = useState<'Deposit' | 'Withdraw' | 'History'>('Deposit'); // Добавили 'History'
  const tonwallet = useTonWallet(); // Использование хука для TON Connect
  const [tonConnectUI] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);
  const setWalletAddress = useUserStore((state) => state.setWalletAddress);

  // Получаем данные пользователя из Zustand
  const { user } = useUserStore();

  useEffect(() => {
    if (userFriendlyAddress) {
      // Сохраняем адрес кошелька в Zustand
      setWalletAddress(userFriendlyAddress);
    }
  }, [userFriendlyAddress, setWalletAddress]);

  useEffect(() => {
    // Проверяем, что tonwallet не равен null и имеет account.address
    if (userFriendlyAddress && user?.TelegramId) {
      // Отправить адрес в API для сохранения в базе данных
      const saveWalletAddress = async () => {
        try {
          const response = await fetch('/api/userwallet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              TelegramId: String(user.TelegramId), // Передаем telegramId как строку
              walletAddress: userFriendlyAddress, // Передаем адрес кошелька
            }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Адрес кошелька сохранен:', data);
          } else {
            console.error('Ошибка при сохранении кошелька');
          }
        } catch (error) {
          console.error('Ошибка при отправке запроса:', error);
        }
      };

      saveWalletAddress();
    }
  }, [userFriendlyAddress]); // Зависимости, чтобы запрос выполнялся, когда изменяется кошелек или данные пользователя

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Заголовок страницы */}
      <div className="text-center text-3xl font-bold py-8">
        My Wallet  
        <div className="w-full flex justify-center mt-8">
          <TonConnectButton />
        </div>
      </div>
      
      {/* Кнопка для подключения кошелька */}
      {userFriendlyAddress && (
        <div>
          
        </div>
      )}
      {/* Полоска с балансом */}
      <div className="flex justify-center items-center bg-[#1c1c1c] py-4 rounded-lg">
        <div className="flex items-center text-xl">
        <IoPaperPlaneOutline  size={30} color="1E90FF" />
          <span className="ml-2 text-2xl font-bold">{String(user.ecobalance).slice(0, 8)}</span>
          <span className="ml-1">THE</span>
        </div>
      </div>

      {/* Вкладки Deposit и Withdraw */}
      
      {/* Вкладки Deposit, Withdraw и History */}
      <div className="flex justify-center mt-6 mb-8">
      {/* Deposit Tab */}
      <div
        className={`flex-1 text-center py-2 cursor-pointer rounded-t-lg relative
        ${selectedTab === 'Deposit' 
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg' 
          : 'bg-transparent text-gray-400 hover:text-white font-bold py-3 px-8 rounded-xl'}`}
        onClick={() => setSelectedTab('Deposit')}
      >
        Deposit
        {/* Hover effect only on non-active tabs */}
        <div
          className={`absolute bottom-0 left-0 w-full h-1 rounded-t-full 
          ${selectedTab === 'Deposit' ? 'bg-transparent' : 'bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 hover:opacity-100'}`}
        />
      </div>

      {/* Withdraw Tab */}
      <div
        className={`flex-1 text-center py-2 cursor-pointer rounded-t-lg relative
        ${selectedTab === 'Withdraw' 
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg' 
          : 'bg-transparent text-gray-400 hover:text-white font-bold py-3 px-8 rounded-xl'}`}
        onClick={() => setSelectedTab('Withdraw')}
      >
        Withdraw
        {/* Hover effect only on non-active tabs */}
        <div
          className={`absolute bottom-0 left-0 w-full h-1 rounded-t-full 
          ${selectedTab === 'Withdraw' ? 'bg-transparent' : 'bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 hover:opacity-100'}`}
        />
      </div>

      {/* History Tab */}
      <div
        className={`flex-1 text-center py-2 cursor-pointer rounded-t-lg relative
        ${selectedTab === 'History' 
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg' 
          : 'bg-transparent text-gray-400 hover:text-white font-bold py-3 px-8 rounded-xl'}`}
        onClick={() => setSelectedTab('History')}
      >
        History
        {/* Hover effect only on non-active tabs */}
        <div
          className={`absolute bottom-0 left-0 w-full h-1 rounded-t-full 
          ${selectedTab === 'History' ? 'bg-transparent' : 'bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 hover:opacity-100'}`}
        />
      </div>
    </div>

      {/* Отображение содержимого вкладки */}
      {selectedTab === 'Deposit' && <DepositTab />}
      {selectedTab === 'Withdraw' && <WithdrawTab />}
      {selectedTab === 'History' && <TransactionHistory />} {/* Добавили отображение истории */}
    </div>
  );
};

export default Wallet;
