'use client';

import { TonConnectButton, useTonConnectUI, SendTransactionRequest } from '@tonconnect/ui-react';
import Wallet from '@/icons/Wallet';
import PawsLogo from '@/icons/PawsLogo';
import Community from '@/icons/Community';
import Star from '@/icons/Star';
import Image from 'next/image';
import ArrowRight from '@/icons/ArrowRight';
import { sparkles } from '@/images';
import { sun } from '@/images';

const DepositTab = () => {
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

  return (
    <div className="flex flex-col items-center mt-8">
      <button
        className="shine-effect bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center gap-3"
      >
        <span>Deposit ECO</span>
      </button>
    </div>
  );
};

export default DepositTab;