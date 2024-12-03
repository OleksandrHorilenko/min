'use client';

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.Telegram?.WebApp) {
        // Если приложение открыто в Telegram
        const tg = window.Telegram.WebApp;
        tg.ready(); // Готовим WebApp

        const initData = tg.initData || '';
        const initDataUnsafe = tg.initDataUnsafe || {};

        console.log('Telegram initData:', initData);
        console.log('Telegram initDataUnsafe:', initDataUnsafe);

        if (initDataUnsafe.user) {
          // Если есть данные пользователя из Telegram
          const user = initDataUnsafe.user as UserData;
          setUserData(user);
          localStorage.setItem('userData', JSON.stringify(user)); // Сохраняем в localStorage

          // Отправляем данные на сервер
          fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.error) {
                setError(data.error);
              } else {
                setUser(data);
              }
            })
            .catch((err) => {
              console.error('Failed to fetch user data:', err);
              setError('Failed to fetch user data');
            });
        } else {
          setError('No user data available from Telegram');
          console.error('No user data available from Telegram:', initDataUnsafe);
        }
      } else {
        // Если приложение не открыто в Telegram
        const searchParams = new URLSearchParams(window.location.hash.substring(1));
        const tgWebAppData = searchParams.get('tgWebAppData');

        if (tgWebAppData) {
          try {
            const userParam = new URLSearchParams(tgWebAppData).get('user');
            const decodedUserParam = userParam ? decodeURIComponent(userParam) : null;
            const userObject = decodedUserParam ? JSON.parse(decodedUserParam) : null;

            if (userObject) {
              const userData = {
                id: userObject.id || 12345,
                first_name: userObject.first_name || 'Имя',
                last_name: userObject.last_name || 'Фамилия',
                username: userObject.username || 'username',
                language_code: userObject.language_code || 'en',
                is_premium: userObject.is_premium || false,
              };
              setUserData(userData);
              localStorage.setItem('userData', JSON.stringify(userData));

              // Отправляем данные на сервер
              fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.error) {
                    setError(data.error);
                  } else {
                    setUser(data);
                  }
                })
                .catch((err) => {
                  console.error('Failed to send user data:', err);
                  setError('Failed to send user data');
                });
            } else {
              console.error('Failed to parse user data from URL.');
              setError('Invalid user data in URL');
            }
          } catch (err) {
            console.error('Error parsing tgWebAppData:', err);
            setError('Error parsing tgWebAppData');
          }
        } else {
          // Устанавливаем тестовые данные
          const testUserData = {
            id: 12345,
            first_name: 'Test User',
            last_name: 'Testov',
            username: 'testuser',
            language_code: 'en',
            is_premium: true,
          };
          setUserData(testUserData);
          localStorage.setItem('userData', JSON.stringify(testUserData));

          // Отправляем тестовые данные на сервер
          fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUserData),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.error) {
                setError(data.error);
              } else {
                setUser(data);
              }
            })
            .catch((err) => {
              console.error('Failed to send test user data:', err);
              setError('Failed to send test user data');
            });

          setError('This app should be opened in Telegram');
        }
      }
    }
  }, []);

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
