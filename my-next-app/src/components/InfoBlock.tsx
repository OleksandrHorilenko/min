import React, { useEffect, useState } from 'react';
import { LinearProgress, Button } from '@mui/material';
import useUserStore from "@/stores/useUserStore";
import fetchUserCollection from "@/app/functions/fetchUserCollection";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setServerTime(new Date());
    }, 1000); // Обновляем время каждую секунду

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user && user.TelegramId) {
      const fetchCollection = async () => {
        try {
          const collection = await fetchUserCollection(user.TelegramId);
          setUserCollection(collection);
        } catch (error) {
          console.error("Ошибка при получении коллекции карт:", error);
        }
      };
      fetchCollection();
    }
  }, [user]);

  const calculateMinedCoins = (card: Card, currentTime: Date) => {
    const { cardlastclaim, miningcoins, miningperiod, remainingcoins } = card;
    const lastClaimDate = new Date(cardlastclaim);
    const elapsedSeconds = (currentTime.getTime() - lastClaimDate.getTime()) / 1000;

    const profitPerSecond = miningcoins / (miningperiod * 24 * 60 * 60);
    const minedSinceLastClaim = Math.min(remainingcoins, profitPerSecond * elapsedSeconds);

    return minedSinceLastClaim;
  };

  const getTotalMinedCoins = () => {
    if (!serverTime) return 0;

    return userCollection.reduce((total, card) => {
      return total + calculateMinedCoins(card, serverTime);
    }, 0);
  };

  const handleClaim = async () => {
    if (!user || !serverTime) {
      console.error("Не хватает данных для обновления");
      return;
    }

    const totalMinedCoins = getTotalMinedCoins();

    try {
      const updatedCollection = userCollection.map((card) => {
        const minedCoins = calculateMinedCoins(card, serverTime);
        return {
          ...card,
          minedcoins: card.minedcoins + minedCoins,
          remainingcoins: card.remainingcoins - minedCoins,
          cardlastclaim: serverTime.toISOString(),
        };
      });

      // Обновляем баланс пользователя
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
      // Обновляем баланс пользователя на клиенте
    const updatedUser = {
      ...user,
      ecobalance: user.ecobalance + totalMinedCoins,
    };

    useUserStore.setState({ user: updatedUser }); // Обновляем состояние
    localStorage.setItem('UserData', JSON.stringify(updatedUser)); // Сохраняем в localStorage
      // Обновляем коллекцию карт
      setUserCollection(updatedCollection);

       // Активируем таймер блокировки кнопки
       setIsButtonDisabled(true);
       setCountdown(300); // 5 минут = 300 секунд

      console.log("Данные успешно обновлены!");
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
    }
  };
  

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
      <div className="w-full max-w-4xl bg-[#1a1a1a] rounded-2xl shadow-lg p-6 flex flex-col space-y-6">
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

        {userCollection.length > 0 &&
          userCollection.map((card, index) => {
            const minedCoins = calculateMinedCoins(card, serverTime || new Date());

            return (
              <div
                key={index}
                className="w-full bg-[#2a2a2a] rounded-2xl shadow-lg p-6 flex flex-col space-y-1 text-white hover:shadow-2xl transition-shadow duration-300 ease-in-out"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Card Name:</span>
                  <span className="font-bold">{card.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Mined Coins:</span>
                  <span className="font-bold">{(card.minedcoins + minedCoins).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Remaining Coins:</span>
                  <span className="font-bold">{(card.remainingcoins - minedCoins).toFixed(2)}</span>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={(card.minedcoins + minedCoins) / card.miningcoins * 100}
                  color="primary"
                  className="my-4 rounded-lg"
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default InfoBlock;








