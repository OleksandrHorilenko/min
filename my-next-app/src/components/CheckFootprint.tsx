'use client';
import { useEffect, useState } from 'react';
import useUserStore from '../stores/useUserStore'; // Подключаем Zustand хранилище
import ArrowBigRight from "@/icons/ArrowBigRight";
import { sun, sparkles } from '@/images';
import Image from 'next/image';
const CheckFootprint = () => {
  const { user } = useUserStore();  // Получаем пользователя из Zustand

  return (
    <div className="flex justify-center w-full">
      <div className="fixed top-0 w-full max-w-md px-4 py-3 bg-[#151516] cursor-pointer">
        <div className="flex justify-between items-center pl-2 border-l-[2px] border-[#4c9ce2]">
          <div className="flex items-center gap-4 text-base text-white font-medium">
            <span></span><Image src={sun} alt="Sun" width={40} height={40} />
            {user && user.TelegramId && (  // Проверяем, что данные пользователя существуют в Zustand
              <span className="text-white"> {user.ecobalance.toFixed(3)}</span>  // Выводим Telegram ID из Zustand
            )}
          </div>
          <button className="bg-[#4c9ce2] rounded-full px-2 py-1">
            <ArrowBigRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckFootprint;

