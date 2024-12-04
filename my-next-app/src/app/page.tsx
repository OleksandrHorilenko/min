'use client';

import { CircleLoader } from 'react-spinners';
import CheckFootprint from '@/components/CheckFootprint';
import NavigationBar from '@/components/NavigationBar';
import TabContainer from '@/components/TabContainer';
import { TabProvider } from '@/contexts/TabContext';
import { useEffect, useState } from 'react';
import { WebApp } from '@twa-dev/types';

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp;
    };
  }
}

// Define the interface for user data
interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(true);  // Лоадер по умолчанию включен

  useEffect(() => {
    const loadData = async () => {
      if (typeof window !== 'undefined') {
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          tg.ready(); // Готовим WebApp

          const initDataUnsafe = tg.initDataUnsafe || {};

          if (initDataUnsafe.user) {
            const user = initDataUnsafe.user as UserData;
            setUserData(user);
            localStorage.setItem('userData', JSON.stringify(user));

            try {
              const response = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
              });
              const data = await response.json();
              if (data.error) {
                setError(data.error);
              } else {
                setUser(data);
              }
            } catch (err) {
              console.error('Failed to fetch user data:', err);
              setError('Failed to fetch user data');
            }
          } else {
            setError('No user data available from Telegram');
          }
        } else {
          setError('This app should be opened in Telegram');
        }
      }

      setLoading(false);  // Останавливаем лоадер после загрузки данных
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">  {/* Задаем фон для лоадера */}
      <CircleLoader size={100} color="#36d7b7" loading={true} />
    </div>
    );
  }

  return (
    <TabProvider>
      <main className="min-h-screen bg-black text-white">
        <CheckFootprint />
        <TabContainer />
        <NavigationBar />
      </main>
    </TabProvider>
  );
}

