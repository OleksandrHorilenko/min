import React, { useEffect, useState } from 'react';
import { LinearProgress, Button } from '@mui/material';
import useUserStore from "@/stores/useUserStore";
import fetchUserCollection from "@/app/functions/fetchUserCollection";
import {updateUserMiningData} from "@/app/functions/updateUserMining";
import { useTab } from '@/contexts/TabContext'

interface Card {
  cardId: number;
  serialNumber: string;
  isActive: boolean;
  acquiredAt: string;
  rarity: string;
  title: string;
  description: string;
  miningcoins: number;
  miningperiod: number;
  miningcycle: number;
  profitperhour: number;
  minedcoins: number;
  remainingcoins: number;
  price: number;
  edition: number;
  cardlastclaim: string;
}

const InfoBlock: React.FC = () => {
  const [serverTime, setServerTime] = useState<Date | null>(null);
  const [userCollection, setUserCollection] = useState<Card[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const user = useUserStore((state) => state.user);
  const [currentTab, setCurrentTab] = useState('leaderboard');
  const { activeTab, setActiveTab } = useTab()

  useEffect(() => {
    const interval = setInterval(() => {
      setServerTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user && user.TelegramId) {
      const fetchCollection = async () => {
        try {
          const collection = await fetchUserCollection(user.TelegramId);
          setUserCollection(collection);
          localStorage.setItem('userCollection', JSON.stringify(collection));
        } catch (error) {
          console.error("Ошибка при получении коллекции карт:", error);
        }
      };
      fetchCollection();
    }
  }, [user]);



  // Функция для вычисления оставшегося времени для каждой карты
  const calculateTimeSinceLastClaim = (card: Card, currentTime: Date) => {
    const lastClaimDate = new Date(card.cardlastclaim);
    const elapsedSeconds = (currentTime.getTime() - lastClaimDate.getTime()) / 1000; // Время в секундах
    return elapsedSeconds;
  };

   // Вычисление общего времени
   const getMinTimeSinceLastClaim = () => {
    if (!serverTime || userCollection.length === 0) return 0;

    // Находим минимальное время, прошедшее с последнего обновления среди всех карт
    const times = userCollection.map(card => calculateTimeSinceLastClaim(card, serverTime));
    return Math.min(...times); // Минимальное время (в секундах)
  };

  const calculateMinedCoins = (card: Card, currentTime: Date) => {
    const { cardlastclaim, miningcoins, remainingcoins } = card;
    const lastClaimDate = new Date(cardlastclaim);
    const elapsedSeconds = (currentTime.getTime() - lastClaimDate.getTime()) / 1000; // Время в секундах
  
    const profitPerSecond = card.profitperhour / 3600; // Профит за секунду
    const minedSinceLastClaim = profitPerSecond * elapsedSeconds; // Сколько монет добыто с момента последнего забора
  
    // Ограничиваем количество добытых монет
    const actualMinedCoins = Math.min(minedSinceLastClaim, remainingcoins);
  
    return actualMinedCoins;
  };
  

  const getTotalMinedCoins = () => {
    if (!serverTime) return 0;
  
    return userCollection.reduce((total, card) => {
      const minedSinceLastClaim = calculateMinedCoins(card, serverTime);
      return total + minedSinceLastClaim;
    }, 0);
  };

  const handleClaim = async () => {
    if (!user || !serverTime) {
      console.error("Не хватает данных для обновления");
      return;
    }

       // Активируем таймер блокировки кнопки
       setIsButtonDisabled(true);
       setCountdown(300); // 5 минут = 300 секунд
  
    const totalMinedCoins = getTotalMinedCoins();
  
    try {
      const updatedCollection = userCollection.map((card) => {
        const minedCoins = calculateMinedCoins(card, serverTime);
  
        // Обновляем количество добытых монет и оставшиеся монеты
        return {
          ...card,
          minedcoins: Math.min(card.minedcoins + minedCoins, card.miningcoins), // Не даем minedcoins превышать miningcoins
          remainingcoins: Math.max(card.remainingcoins - minedCoins, 0), // Не даем remainingcoins быть меньше 0
          cardlastclaim: serverTime.toISOString(), // Обновляем дату последнего забора
        };
      });
  
      // Обновление на сервере и локально
      await fetch('/api/updateUserBalance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TelegramId: user.TelegramId,
          ecobalance: totalMinedCoins,
          action: 'increment',
        }),
      });
  
      // Отправка обновленной коллекции на сервер
      const response = await fetch('/api/updateUserCollectionInDB', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TelegramId: user.TelegramId,
          cards: updatedCollection.map((card) => ({
            cardId: card.cardId,
            serialNumber: card.serialNumber,
            isActive: card.isActive,
            rarity: card.rarity,
            title: card.title,
            description: card.description,
            miningcoins: card.miningcoins,
            miningperiod: card.miningperiod,
            miningcycle: card.miningcycle,
            profitperhour: card.profitperhour,
            minedcoins: card.minedcoins,
            remainingcoins: card.remainingcoins,
            price: card.price,
            edition: card.edition,
            cardlastclaim: card.cardlastclaim,
            acquiredAt: card.acquiredAt,
          })),
        }),
      });
  
      const data = await response.json();
  
      if (response.status !== 200) {
        throw new Error(data.error || 'Не удалось обновить коллекцию');
      }
  
      // Обновляем данные пользователя локально
      useUserStore.setState({ user: { ...user, ecobalance: user.ecobalance + totalMinedCoins } });
  
      // Обновляем состояние коллекции в приложении
      setUserCollection(updatedCollection);
      localStorage.setItem('userCollection', JSON.stringify(updatedCollection));

       updateUserMiningData('increment', totalMinedCoins, user.TelegramId)
 .then(data => console.log('Updated data:', data))
  .catch(err => console.error('Error:', err));
  
   
  
      console.log("Данные успешно обновлены!");
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
    }
  };
  

  // Привязка времени на основе минимального времени с последнего обновления
  useEffect(() => {
    if (!serverTime || userCollection.length === 0) return;

    const minTimeSinceLastClaim = getMinTimeSinceLastClaim();
    if (minTimeSinceLastClaim < 300) { // Если прошло меньше 5 минут (300 секунд)
      setIsButtonDisabled(true);
      setCountdown(300 - Math.floor(minTimeSinceLastClaim)); // Оставшееся время до 5 минут
    } else {
      setIsButtonDisabled(false);
    }
  }, [serverTime, userCollection]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setIsButtonDisabled(false);
    }
  }, [countdown]);


  return (
    <div className="bg-[#121212] flex flex-col items-center">
    <div className="w-full max-w-6xl bg-[#1a1a1a] rounded-2xl shadow-lg p-6 flex flex-col space-y-6 items-center justify-center">
      <div className="text-white text-lg font-bold hover:text-gray-300 transition-colors flex flex-col items-center justify-center">
        <span>Total mined since last claim:</span>
        <span className="text-4xl">{getTotalMinedCoins().toFixed(3)}</span>
      </div>
  
      <Button
        variant="contained"
        color="primary"
        onClick={handleClaim}
        disabled={isButtonDisabled}
        className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg ${
          isButtonDisabled ? "opacity-50 cursor-not-allowed" : "hover:from-blue-600 hover:to-purple-600 transition duration-300 ease-in-out transform hover:scale-105"
        }`}
      >
        {isButtonDisabled ? `Wait ${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')}` : "Claim All"}
      </Button>
  
      {userCollection.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-[200px] bg-gray-700 rounded-2xl shadow-lg p-6 mb-6">
          <p className="text-xl text-white font-bold mb-4">You don't have any cards yet.</p>
          <Button
            variant="contained"
            color="primary"
            key={'leaderboard'}
            onClick={() => console.log(setActiveTab('leaderboard'))}
            className="shine-effect bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg"
          >
            Buy your first card
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
        {userCollection.map((card, index) => {
  const minedCoins = calculateMinedCoins(card, serverTime || new Date());
  const remainingPercentage = ((card.remainingcoins / card.miningcoins) * 100).toFixed(2);

  const bgColor = (() => {
    switch (card.rarity) {
      case "Common":
        return "bg-[#121212] border-[#8A2BE2]";
      case "Rare":
        return "bg-[#1B0036] border-[#00FFFF]";
      case "Epic":
        return "bg-[#30003B] border-[#FF00FF]";
      default:
        return "bg-[#1A1A1A] border-[#C0C0C0]";
    }
  })();

  return (
    <div
      key={index}
      className={`relative w-[300px] h-[200px] ${bgColor} border-2 rounded-2xl shadow-lg p-3 flex flex-col justify-between mb-4`}
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)',
      }}
    >
      {/* Верхняя часть карточки */}
      <div className="flex justify-between items-center mb-1">
        <div>
          <p className="text-[10px] text-gray-400 font-bold">Card Name</p>
          <h2 className="text-sm font-bold text-white truncate">{card.title}</h2>
        </div>
        <div className="bg-white/10 p-[2px] rounded-md shadow-md">
          <p className="text-[10px] font-medium text-gray-300">{card.rarity}</p>
        </div>
      </div>

      {/* Основная информация */}
      <div>
        <p className="text-gray-300 text-xs">
          <strong className="text-xl text-yellow-400">{card.miningcoins}</strong>
          <span className="text-sm text-gray-300"> THE</span>
        </p>
        <p className="text-[10px] text-gray-400 mt-1">{card.miningperiod} days</p>
      </div>

      {/* Прогресс добычи */}
      <div className="my-1">
        <LinearProgress
          variant="determinate"
          value={((card.minedcoins + minedCoins) / card.miningcoins) * 100}
          color="primary"
          className="rounded-lg"
        />
      </div>

      <div className="flex justify-between items-center mt-1 space-x-2 whitespace-nowrap">
        <p className="text-[10px] text-gray-400">Remaining Coins:</p>
        <p className="text-[10px] font-bold text-gray-300">{Math.round(card.remainingcoins)}  ({remainingPercentage}%)</p>
      </div>

      {/* Новый блок внутри карточки */}
      <div className="flex justify-between items-center bg-[#1e1e1e] rounded-md p-1 mt-2">
        <div className="flex items-center space-x-1">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              card.isActive ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <p className="text-[10px] font-medium text-gray-300">
            {card.isActive ? "Active" : "Inactive"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400">Profit per Hour:</p>
          <p className="text-sm font-bold text-yellow-400">
            {card.profitperhour.toFixed(2)} THE
          </p>
        </div>
      </div>
    </div>
  );
})}
        </div>
      )}
    </div>
  </div>
  
  );
};

export default InfoBlock;









