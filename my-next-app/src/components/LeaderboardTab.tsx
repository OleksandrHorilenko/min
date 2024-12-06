

'use client'

import PawsLogo from '@/icons/PawsLogo'
import { trophy } from '@/images';
import { sun } from '@/images';
import Image from 'next/image'
import useUserStore from '@/stores/useUserStore'; // Подключаем хранилище пользователя





export default function CardCollection() {
    return (
        <div className="flex flex-col items-center space-y-8 bg-black py-12">
        {/* Карты в общем контейнере */}
        <div className="flex flex-wrap justify-center gap-8">
          {/* Золотая карта */}
          <Card
            title="Golden Card"
            gradient="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600"
          />
  
          {/* Платиновая карта */}
          <Card
            title="Platinum Card"
            gradient="bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500"
          />
  
          {/* Голубая карта */}
          <Card
            title="Blue Card"
            gradient="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600"
          />
        </div>
      </div>
    );
  }
  
  function Card({ title, gradient }) {
    return (
      <div className="relative w-[400px] h-auto flex flex-col items-center space-y-4 p-6 rounded-lg shadow-2xl">
        {/* Карта */}
        <div className={`relative w-full h-[200px] rounded-lg overflow-hidden ${gradient}`}>
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 animate-shine"></div>
  
          {/* Логотип */}
          <div className="absolute top-6 left-6 flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/30 to-black/10 shadow-inner flex items-center justify-center">
              <span className="text-xl font-bold text-white">E</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-widest">ELIS PARIS</span>
          </div>
  
          {/* Правая верхняя информация */}
          <div className="absolute top-6 right-6 text-right">
            <p className="text-white text-lg font-bold leading-tight">1000 ECO</p>
            <p className="text-white text-sm leading-tight">100 days, 8 hours</p>
            <p className="text-white text-xs font-light leading-tight">≈0.42 ECO/H</p>
          </div>
  
          {/* Центральный текст */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-4xl font-bold shadow-md">1000 ECO</span>
          </div>
  
          {/* Номер карты */}
          <div className="absolute bottom-14 left-6 text-white font-mono text-sm tracking-widest shadow-md">
            1234 5678 9012 3456
          </div>
  
          {/* Имя владельца */}
          <div className="absolute bottom-6 left-6 text-white font-semibold tracking-wider text-lg shadow-md">
            JOHN DOE
          </div>
  
          {/* Дата истечения срока */}
          <div className="absolute bottom-6 right-6 text-white text-sm tracking-wider font-light shadow-md">
            12/25
          </div>
        </div>
  
        {/* Кнопки под картой */}
        <div className="flex justify-center space-x-4">
          <Button label="Buy ECO" color="bg-green-500" />
          <Button label="Buy TON" color="bg-blue-500" />
          <Button label="Buy STARS" color="bg-yellow-500" />
        </div>
      </div>
    );
  }
  
  function Button({ label, color }) {
    return (
      <button
        className={`px-6 py-2 text-white rounded-full shadow-lg font-semibold hover:opacity-90 transition-all ${color}`}
      >
        {label}
      </button>
    );
  }
  
  <style jsx>{`
    @keyframes shine {
      0% {
        transform: translateX(-100%);
        opacity: 0.5;
      }
      50% {
        opacity: 1;
      }
      100% {
        transform: translateX(100%);
        opacity: 0.5;
      }
    }
    .animate-shine {
      animation: shine 3s infinite linear;
    }
  `}</style>