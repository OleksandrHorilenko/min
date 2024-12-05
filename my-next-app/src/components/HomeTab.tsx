'use client';

import Wallet from '@/icons/Wallet';
import { TonConnectButton, useTonConnectUI, SendTransactionRequest } from '@tonconnect/ui-react';
import PawsLogo from '@/icons/PawsLogo';
import Community from '@/icons/Community';
import Star from '@/icons/Star';
import Image from 'next/image';
import ArrowRight from '@/icons/ArrowRight';
import { sparkles } from '@/images';
import { sun } from '@/images';

const HomeTab = () => {
  // Определение транзакции
  const transaction: SendTransactionRequest = {
    validUntil: Date.now() + 5 * 60 * 1000, // 5 минут
    messages: [
      {
        address: "UQAK-eku1yCNkL5wt7g9OlBpHSnjadN10h_A19uM3SGVJIu2", // адрес получателя
        amount: "2000000", // сумма в нанотонах (0.002 TON)
      },
    ],
  };

  // Использование хука для TON Connect
  const [tonConnectUI] = useTonConnectUI();

  return (
    <div className={`home-tab-con transition-all duration-300`}>
      {/* Кнопка для подключения кошелька */}
     

      {/* Баланс*/}
      <div className="flex flex-col items-center mt-12">
        <Image src={sun} alt="sparkles" width={108} height={108} />
        {/*  className="w-28 h-28 mb-4" /> */}
        <div className="flex items-center gap-1 text-center">
          <div className="text-6xl font-bold mb-1">4,646</div>
          <div className="text-white text-6xl">ECO</div>
        </div>
        <div className="flex items-center gap-1 text-[#868686] rounded-full px-4 py-1.5 mt-2 cursor-pointer">
          <span>NEWCOMER</span>
          <Image src={sparkles} alt="sparkles" width={18} height={18} />
          <span>RANK</span>
          <ArrowRight className="w-6 h-6" />
        </div>
      </div>

      {/* Действия */}
      <div className="space-y-3 px-4 mt-8 mb-8">
        <div className="flex gap-4 px-4 mt-8 mb-8">
          {/* Кнопка покупки */}
          <button
            className="shine-effect flex-1 bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between"
            onClick={() => tonConnectUI.sendTransaction(transaction)}
          >
            <div className="flex items-center gap-3 font-medium">
              <Community className="w-8 h-8" />
              <span>Buy ECO miner</span>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </button>

          {/* Кнопка проверки */}
          <button className="shine-effect flex-1 bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3 font-medium">
              <Star className="w-8 h-8" />
              <span>Check your rewards</span>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Пример блока описаний */}
        <div className="shine-effect w-full bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 grid grid-cols-3 gap-4">
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center bg-[#2d2d2e] text-white rounded-md p-2"
            >
              <div className="text-sm font-medium">{`Title ${index + 1}`}</div>
              <div className="text-xs text-[#ffffff80]">{`Description ${index + 1}`}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
