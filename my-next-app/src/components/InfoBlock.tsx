import React, { useEffect, useState } from 'react';
//import LinearProgress from '@mui/material/LinearProgress';
// or
import { LinearProgress } from '@mui/material';
import useUserStore from "@/stores/useUserStore"; // Для получения данных пользователя
import fetchUserCollection from "@/app/functions/fetchUserCollection"; // Для получения коллекции карт

interface InfoBlockProps {
  progress: number; // Прогресс (например, 32 для 32%)
}

const InfoBlock: React.FC<InfoBlockProps> = ({ progress }) => {
  const [power, setPower] = useState<number>(0);
  const user = useUserStore((state) => state.user); // Данные пользователя
  const setUser = useUserStore((state) => state.setUser)
  const userCollection = useUserStore((state) => state.userCollection); // Коллекция пользователя

  // Функция для вычисления общей мощности всех карт
  const calculateTotalPower = (cards: any[]) => {
    return cards.reduce((total, card) => {
      const cardPower = card.miningcoins / card.miningperiod / 24; // Мощность карты за час
      return total + cardPower;
    }, 0);
  };

  const activeBoosters = 0;
  const totalProfit = parseFloat((power + activeBoosters).toFixed(3));

  useEffect(() => {
    const fetchAndCalculatePower = async () => {
      if (!user?.TelegramId) return;

      try {
        // Получаем коллекцию карт и обновляем состояние
        await fetchUserCollection(user.TelegramId);

        // Вычисляем мощность только после успешного обновления коллекции
        if (Array.isArray(userCollection)) {
          const totalPower = calculateTotalPower(userCollection);
          setPower(totalPower);
        }
      } catch (error) {
        console.error('Ошибка при получении коллекции карт:', error);
      }
    };

    fetchAndCalculatePower();
  }, [user?.TelegramId]); // Запрос только при изменении TelegramId

  useEffect(() => {
    // Пересчет мощности при изменении коллекции
    if (Array.isArray(userCollection)) {
      const totalPower = calculateTotalPower(userCollection);
      setPower(totalPower);
    }
  }, [userCollection]); // Обновляем мощность при изменении коллекции


  // Обновление количества монет каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        const updatedCoins = user.ecobalance + totalProfit / 3600; // Увеличиваем монеты
        setUser({ ...user, ecobalance: parseFloat(updatedCoins.toFixed(2)) }); // Обновляем состояние
      }
    }, 1000); // Каждую секунду

    return () => clearInterval(interval); // Очищаем интервал при размонтировании
  }, [user, totalProfit]);

  return (
    <div className="w-full bg-[#1a1a1a] rounded-2xl shadow-lg p-6 flex flex-col space-y-4">
      {/* Power Block */}
      <div className="flex justify-between items-center">
        <div className="text-sm font-bold text-white">Power:</div>
        <div className="text-2xl font-bold text-white">
          {power ? power.toFixed(3) : 'Loading...'}
        </div>
      </div>

      {/* Active Boosters Block */}
      <div className="flex justify-between items-center">
        <div className="text-sm font-bold text-white">Active Boosters:</div>
        <div className="text-xl font-bold text-white">+{activeBoosters}%</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full mt-2">
        <LinearProgress variant="determinate" value={progress} color="primary" />
      </div>

      {/* Total Profit Block */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm font-bold text-white">Total Profit per Hour:</div>
        <div className="text-2xl font-bold text-white">{totalProfit} ECO/h</div>
      </div>
    </div>
  );
};

export default InfoBlock;
