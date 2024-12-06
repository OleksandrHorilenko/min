'use client';

import CheckFootprint from '@/components/CheckFootprint';
import NavigationBar from '@/components/NavigationBar';
import TabContainer from '@/components/TabContainer';
import { TabProvider } from '@/contexts/TabContext';
import { useEffect, useState } from 'react';
import { WebApp } from '@twa-dev/types';
import useUserStore from '../stores/useUserStore'; // Импортируем zustand хранилище

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp;
    };
  }
}

// Интерфейс для данных пользователя
interface UserData {
  TelegramId: string; // TelegramId вместо id
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

export default function Home() {
  const [error, setError] = useState<string | null>(null);

  // Доступ к Zustand
  const { setUser: setUserInStore, user } = useUserStore();

  useEffect(() => {
    const fetchUserData = async (userData: UserData) => {
      try {
        const response = await fetch(`/api/user?TelegramId=${userData.TelegramId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          // Если пользователь найден, добавляем данные в Zustand
          const existingUser = await response.json();
          setUserInStore(existingUser);
        } else if (response.status === 404) {
          // Если пользователь не найден, создаем нового
          const createResponse = await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });

          if (!createResponse.ok) {
            throw new Error('Failed to create new user');
          }

          const newUser = await createResponse.json();
          setUserInStore(newUser);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to synchronize user data');
      }
    };

    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const initDataUnsafe = tg.initDataUnsafe || {};

      if (initDataUnsafe.user) {
        const rawUser = initDataUnsafe.user as {
          id: number;
          first_name: string;
          last_name?: string;
          username?: string;
          language_code: string;
          is_premium?: boolean;
        };

        const userData: UserData = {
          TelegramId: String(rawUser.id),
          first_name: rawUser.first_name,
          last_name: rawUser.last_name,
          username: rawUser.username,
          language_code: rawUser.language_code,
          is_premium: rawUser.is_premium,
        };

        fetchUserData(userData);
      } else {
        setError('No user data available from Telegram');
      }
    } else {
      setError('Telegram WebApp not initialized');
    }
  }, [setUserInStore]);

  return (
    <TabProvider>
      <main className="min-h-screen bg-black text-white">
        {error && <p className="text-red-500">{error}</p>}
        <CheckFootprint />
        <TabContainer />
        <NavigationBar />
      </main>
    </TabProvider>
  );
}

