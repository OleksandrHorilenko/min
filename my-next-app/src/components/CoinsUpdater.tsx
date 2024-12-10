import { useEffect } from 'react';
import useUserStore from '@/stores/useUserStore';

const updateCoins = async (TelegramId: string, totalProfit: number) => {

    const setTotalProfit = useUserStore((state) => state.setTotalProfit);
  try {
    const response = await fetch('/api/updateEcoCoins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ TelegramId, totalProfit }),
    });

    if (!response.ok) {
      console.error('Ошибка обновления монет:', await response.text());
    } else {
      const data = await response.json();
      console.log('Монеты обновлены:', data);
    }
  } catch (error) {
    console.error('Ошибка связи с сервером:', error);
  }
};

const CoinsUpdater = () => {
  const user = useUserStore((state) => state.user);
  const totalProfit = useUserStore((state) => state.totalProfit); // Используем данные из стора

  useEffect(() => {
    if (!user?.TelegramId || !totalProfit) return;

    const interval = setInterval(() => {
      updateCoins(user.TelegramId, totalProfit);
    }, 10 * 60 * 1000); // Каждые 10 минут

    return () => clearInterval(interval);
  }, [user?.TelegramId, totalProfit]);

  return null; // Компонент ничего не рендерит
};

export default CoinsUpdater;
