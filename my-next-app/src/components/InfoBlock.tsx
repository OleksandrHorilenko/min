import React, { useEffect, useState } from 'react';
import { LinearProgress, Button } from '@mui/material';
import useUserStore, { UpdatedCard } from "@/stores/useUserStore";
import fetchUserCollection from "@/app/functions/fetchUserCollection";

const InfoBlock: React.FC = () => {
  const [serverTime, setServerTime] = useState<Date | null>(null);
  const [totalMinedCoins, setTotalMinedCoins] = useState<number>(0);
  const [lastClaim, setLastClaim] = useState<Date | undefined>(undefined);
  const [userCollection, setUserCollection] = useState<UpdatedCard[]>([]);
  const user = useUserStore((state) => state.user);

  // useEffect для получения сохраненных данных из localStorage
  useEffect(() => {
    const storedTotalMinedCoins = localStorage.getItem('totalMinedCoins');
    if (storedTotalMinedCoins) {
      setTotalMinedCoins(Number(storedTotalMinedCoins)); // Преобразуем в число и устанавливаем
    }
  }, []); // Этот useEffect срабатывает один раз при монтировании компонента

  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const response = await fetch('/api/getServerTime');
        const data = await response.json();
        setServerTime(new Date(data.serverTime));
      } catch (error) {
        console.error("Ошибка при получении серверного времени:", error);
      }
    };

    fetchServerTime();
    const interval = setInterval(fetchServerTime, 60000);
    return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
  }, []); // Этот useEff

  useEffect(() => {
    // Проверяем, если lastClaim еще не установлено, пытаемся получить его из localStorage
    if (!lastClaim) {
      const storedUserMining = localStorage.getItem('userMining');
      if (storedUserMining) {
        const parsedUserMining = JSON.parse(storedUserMining);
        const storedLastClaim = parsedUserMining?.lastClaim;

        if (storedLastClaim) {
          // Если lastClaim найден в localStorage, обновляем state
          setLastClaim(new Date(storedLastClaim));
        } else {
          // Если значения нет, можно установить значение по умолчанию или выполнить другое действие
          console.log('lastClaim не найден в localStorage, устанавливаем значение по умолчанию');
          setLastClaim(new Date());  // Устанавливаем текущую дату
        }
      } else {
        // Если ключ userMining отсутствует в localStorage
        console.log('userMining не найден в localStorage');
        setLastClaim(new Date());  // Устанавливаем значение по умолчанию
      }
    }
  }, [lastClaim]);  

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

  const calculateProfitPerSecond = (miningcoins: number, miningperiod: number) => {
    const totalSecondsInPeriod = miningperiod * 24 * 60 * 60;
    return miningcoins / totalSecondsInPeriod;
  };

  useEffect(() => {
    if (lastClaim && userCollection.length > 0 && serverTime) {
  
      const totalMined = userCollection.reduce((acc, card) => {
        const cardProfitPerSecond = calculateProfitPerSecond(card.miningcoins, card.miningperiod);
        const timeDifferenceInSeconds = Math.max(0, (serverTime.getTime() - lastClaim.getTime()) / 1000);
        const minedCoinsForCard = cardProfitPerSecond * timeDifferenceInSeconds;
        console.log("Server Time:", serverTime);
        console.log("Last Claim:", lastClaim);
        // Логируем данные для расчета
        console.log("Card:", card);
        console.log("Card Profit Per Second:", cardProfitPerSecond);
        console.log("Time Difference in Seconds:", timeDifferenceInSeconds);
        console.log("Mined Coins for Card:", minedCoinsForCard);
  
        return acc + minedCoinsForCard;
      }, 0);
  
      console.log("Total Mined Coins calculated:", totalMined);
      setTotalMinedCoins(totalMined);
      localStorage.setItem('totalMinedCoins', totalMined.toString());
    }
  }, [lastClaim, userCollection, serverTime]);

  const handleUpdateMiningData = async () => {
    if (!user || !lastClaim || !serverTime) {
      console.error('Не хватает данных для обновления');
      return;
    }
  
    try {
      const newMinedCoins = totalMinedCoins;
      const newLastClaim = serverTime.toISOString();
  
      // Отправляем обновленные данные на сервер для увеличения баланса
      const response = await fetch('/api/userMining', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId: user.TelegramId,
          action: 'increment',
          amount: newMinedCoins,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Ошибка при обновлении данных на сервере.');
      }
  
      // Обновляем баланс пользователя на сервере
      const responseuser = await fetch('/api/updateUserBalance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TelegramId: user.TelegramId,
          action: 'increment',
          ecobalance: newMinedCoins,
        }),
      });
  
      if (!responseuser.ok) {
        throw new Error('Ошибка при обновлении баланса на сервере.');
      }
  
      // Обновляем локальный стейт и localStorage
      user.ecobalance += newMinedCoins; // Обновляем баланс на клиенте
      setLastClaim(new Date(newLastClaim)); // Обновляем lastClaim
  
      // Сохраняем обновленный объект с userMining в localStorage
      const userMiningData = localStorage.getItem('userMining');
      if (userMiningData) {
        const parsedData = JSON.parse(userMiningData);
        parsedData.lastClaim = newLastClaim; // Обновляем lastClaim в объекте
        parsedData.minedCoins = newMinedCoins; // Обновляем minedCoins
        localStorage.setItem('userMining', JSON.stringify(parsedData)); // Сохраняем обновленные данные
      } else {
        // Если данных нет, создаем новый объект и сохраняем
        localStorage.setItem('userMining', JSON.stringify({
          TelegramId: user.TelegramId,
          minedCoins: newMinedCoins,
          lastClaim: newLastClaim,
        }));
      }
  
      console.log('Данные успешно обновлены!');
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
    }
  };
  

  return (
    <div className="bg-[#121212]  flex flex-col items-center">
      <div className="w-full max-w-4xl bg-[#1a1a1a] rounded-2xl shadow-lg p-6 flex flex-col space-y-6">
        <div className="text-white text-lg font-bold hover:text-gray-300 transition-colors flex flex-col items-center justify-center">
          <span>Ready to claim:</span>
          <span className="text-4xl">{totalMinedCoins.toFixed(3)}</span>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateMiningData}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-600 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Claim
        </Button>

        {userCollection.length > 0 &&
          userCollection.map((card, index) => {
            const cardProfitPerSecond = calculateProfitPerSecond(card.miningcoins, card.miningperiod);
            const timeDifferenceInSecondsLastClaim = Math.max(
              0,
              (serverTime!.getTime() - lastClaim!.getTime()) / 1000
            );
            const minedCoinsForCardLastClaim = cardProfitPerSecond * timeDifferenceInSecondsLastClaim;

            const timeDifferenceInSecondsAcquiredAt = card.acquiredAt
              ? Math.max(0, (serverTime!.getTime() - new Date(card.acquiredAt).getTime()) / 1000)
              : 0;
            const minedCoinsForCardAcquiredAt = cardProfitPerSecond * timeDifferenceInSecondsAcquiredAt;

            return (
              <div
                key={index}
                className="w-full bg-[#2a2a2a] rounded-2xl shadow-lg p-6 flex flex-col space-y-1 text-white hover:shadow-2xl transition-shadow duration-300 ease-in-out"
              >
                <div className="flex justify-between items-center space-y-0.5">
                  <span className="text-sm font-medium">Card Name:</span>
                  <span className="font-bold">{card.title}</span>
                </div>
                <div className="flex justify-between items-center space-y-0.5">
                  <span className="text-sm font-medium">Profit P/Sec:</span>
                  <span className="font-bold">{cardProfitPerSecond.toFixed(8)}</span>
                </div>
                <div className="flex justify-between items-center space-y-0.5">
                  <span className="text-sm font-medium">Mined to Claim:</span>
                  <span className="font-bold">{minedCoinsForCardLastClaim.toFixed(8)}</span>
                </div>
                <div className="flex justify-between items-center space-y-0.5">
                  <span className="text-sm font-medium">Mined Coins:</span>
                  <span className="font-bold">{minedCoinsForCardAcquiredAt.toFixed(8)}</span>
                </div>
                <div className="flex justify-between items-center space-y-0.5">
                  <span className="text-sm font-medium">Card Coins:</span>
                  <span className="font-bold">{card.miningcoins}</span>
                </div>
                <div className="relative w-full">
                  <LinearProgress
                    variant="determinate"
                    value={(card.miningcoins / totalMinedCoins) * 100 || 0}
                    color="primary"
                    className="my-4 rounded-lg"
                  />
                  <span className="absolute top-5 right-0 text-sm text-gray-400">
                    {`${(((card.miningcoins - totalMinedCoins) / card.miningcoins) * 100).toFixed(2)}%`}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default InfoBlock;





