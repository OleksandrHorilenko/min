import React, { useEffect, useState } from 'react';
import { LinearProgress, Button } from '@mui/material';
import useUserStore, { UpdatedCard } from "@/stores/useUserStore";
import fetchUserCollection from "@/app/functions/fetchUserCollection";

const InfoBlock: React.FC = () => {
  const [serverTime, setServerTime] = useState<Date | null>(null);
  const [totalMinedCoins, setTotalMinedCoins] = useState<number>(0);
  const [lastClaim, setLastClaim] = useState<Date | null>(null);
  const [userCollection, setUserCollection] = useState<UpdatedCard[]>([]);
  const user = useUserStore((state) => state.user);

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
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!lastClaim && serverTime) {
      setLastClaim(serverTime);
    }
  }, [serverTime, lastClaim]);

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
        return acc + cardProfitPerSecond * timeDifferenceInSeconds;
      }, 0);
      setTotalMinedCoins(totalMined);
    }
  }, [lastClaim, userCollection, serverTime]);




  const handleUpdateMiningData = async () => {
   
    //const [isDisabled, setIsDisabled] = useState(false);
   // const [timeLeft, setTimeLeft] = useState(0);
   

    if (!user || !lastClaim || !serverTime) {
      console.error('Не хватает данных для обновления');
      return;
    }

    try {
      const newMinedCoins = totalMinedCoins;
      const newLastClaim = serverTime.toISOString();

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
        throw new Error('Ошибка при обновлении данных на сервере.');
      }
      user.ecobalance +=newMinedCoins;
      setLastClaim(new Date(newLastClaim));
      setTotalMinedCoins(0);
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
    value={(card.miningcoins/totalMinedCoins ) * 100 || 0}
    color="primary"
    className="my-4 rounded-lg"
  />
  <span className="absolute top-5 right-0 text-sm text-gray-400">
    {`${(100 - ((totalMinedCoins/card.miningcoins) * 100 || 0)).toFixed(2)}%`}
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





