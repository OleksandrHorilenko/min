'use client';

import React, { useEffect, useState } from 'react';
import DepositTab from './DepositTab';
import WithdrawTab from './WithdrawTab';
import Image from 'next/image';
import { sun } from '@/images'; // Импортируем изображение солнца
import { TonConnectButton, useTonConnectUI, useTonWallet, useTonAddress } from '@tonconnect/ui-react';
import useUserStore from '@/stores/useUserStore'; // Подключаем хранилище пользователя

const Wallet = () => {
  const [selectedTab, setSelectedTab] = useState<'Deposit' | 'Withdraw'>('Deposit'); // Состояние для переключения вкладок
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
  }, [tonwallet, user?.TelegramId, userFriendlyAddress]); // Зависимости, чтобы запрос выполнялся, когда изменяется кошелек или данные пользователя

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
          <span>User-friendly address: {userFriendlyAddress}</span>
          <span>Raw address: {rawAddress}</span>
          <span>Telegram ID: {String(user.TelegramId)}</span> {/* Отображение telegramId */}
        </div>
      )}
      {/* Полоска с балансом */}
      <div className="flex justify-center items-center bg-[#1c1c1c] py-4 rounded-lg">
        <div className="flex items-center text-xl">
          <Image src={sun} alt="sparkles" width={24} height={24} />
          <span className="ml-2 text-2xl font-bold">{String(user.ecobalance)}</span>
          <span className="ml-1">ECO</span>
        </div>
      </div>

      {/* Вкладки Deposit и Withdraw */}
      <div className="flex justify-center mt-6 mb-8">
        <div
          className={`flex-1 text-center py-2 cursor-pointer rounded-t-lg ${selectedTab === 'Deposit' ? 'bg-[#333] border-b-4 border-[#FFA500]' : 'bg-transparent'}`}
          onClick={() => setSelectedTab('Deposit')}
        >
          Deposit
        </div>
        <div
          className={`flex-1 text-center py-2 cursor-pointer rounded-t-lg ${selectedTab === 'Withdraw' ? 'bg-[#333] border-b-4 border-[#FFA500]' : 'bg-transparent'}`}
          onClick={() => setSelectedTab('Withdraw')}
        >
          Withdraw
        </div>
      </div>

      {/* Отображение содержимого вкладки */}
      {selectedTab === 'Deposit' && <DepositTab />}
      {selectedTab === 'Withdraw' && <WithdrawTab />}
    </div>
  );
};

export default Wallet;
