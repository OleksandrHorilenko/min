'use client';

import { useState } from 'react';
import DepositTab from './DepositTab';
import WithdrawTab from './WithdrawTab';
import Image from 'next/image';
import { sun } from '@/images'; // Импортируем изображение солнца
import { TonConnectButton, useTonConnectUI, SendTransactionRequest } from '@tonconnect/ui-react';

const Wallet = () => {
  const [selectedTab, setSelectedTab] = useState<'Deposit' | 'Withdraw'>('Deposit'); // Состояние для переключения вкладок
  // Использование хука для TON Connect
  const [tonConnectUI] = useTonConnectUI();
  return (
    <div className="bg-black min-h-screen text-white">
      {/* Заголовок страницы */}
      <div className="text-center text-3xl font-bold py-8">
        My Wallet  <div className="w-full flex justify-center mt-8">
        <TonConnectButton />
      </div>
      </div>
      
     
      {/* Кнопка для подключения кошелька */}
   
     

      {/* Полоска с балансом */}
      <div className="flex justify-center items-center bg-[#1c1c1c] py-4 rounded-lg">
        <div className="flex items-center text-xl">
          <Image src={sun} alt="sparkles" width={24} height={24} />
          <span className="ml-2 text-2xl font-bold">4,646</span>
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
