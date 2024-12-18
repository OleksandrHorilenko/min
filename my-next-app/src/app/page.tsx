'use client';

import CheckFootprint from '@/components/CheckFootprint';
import NavigationBar from '@/components/NavigationBar';
import TabContainer from '@/components/TabContainer';
import { TabProvider } from '@/contexts/TabContext';
import { useEffect, useState } from 'react';
import { WebApp } from '@twa-dev/types';
//import WebApp from '@twa-dev/sdk';
import useUserStore from '../stores/useUserStore'; // Импортируем zustand хранилище
import FriendsTab from '@/components/FriendsTab'

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp;
    };
  }
}

// Define the interface for user data
interface UserData {
  TelegramId: string; // Заменяем id на telegramId
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
  ecobalance: Number;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState('');
  const [loader, setLoader] = useState(false);
  const [userMining, setUserMining] = useState<any>(null);
  const [lastClaim, setLastClaim] = useState<Date | null>(null);
  const [initData, setInitData] = useState('')
  const [startParam, setStartParam] = useState('')
  const [userId, setUserId] = useState('')
  
  //const telegram = window.Telegram.WebApp;

  // Доступ к состоянию из Zustand
  const { setUser: setUserInStore } = useUserStore();
   
  useEffect(() => {
    const initWebApp = async () => {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready(); // Подготовка SDK

        setInitData(WebApp.initData); // Инициализация данных
        setUserId(WebApp.initDataUnsafe.user?.id.toString() || ''); // Получаем ID пользователя

        // Извлекаем start_param, который может содержать реферальный код
        const referralCode = WebApp.initDataUnsafe.start_param || '';
        setStartParam(referralCode); // Сохраняем реферальный код
        console.log('Referral Code:', referralCode); // Для отладки
      }
    };

    initWebApp();
  }, []);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready(); // Готовим WebApp
  
        const initData = tg.initData || '';
        const initDataUnsafe = tg.initDataUnsafe || {};
        //const startParam = initDataUnsafe.start_param;
  
        console.log('Telegram initData:', initData);
        console.log('Telegram initDataUnsafe:', initDataUnsafe);
  
        // Проверяем наличие start_param
        if (initDataUnsafe.start_param) {
         // setStartParam(initDataUnsafe.start_param);
          console.log('Referral code (start_param):', initDataUnsafe.start_param);
        }
  
        if (initDataUnsafe.user) {
          const rawUser = initDataUnsafe.user as unknown as {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code: string;
            is_premium?: boolean;
          };
  
          // Преобразуем id в telegramId
          const user: UserData = {
            TelegramId: String(rawUser.id), // Преобразование id в строку
            first_name: rawUser.first_name,
            last_name: rawUser.last_name,
            username: rawUser.username,
            language_code: rawUser.language_code,
            is_premium: rawUser.is_premium,
            ecobalance: 0,
          };
  
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
                fetchUserData(user.TelegramId);
                fetchUserMining(user.TelegramId);
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
        // Обработка URL параметров, если не доступен WebApp
        const searchParams = new URLSearchParams(window.location.search);
        const tgWebAppData = searchParams.get('tgWebAppData');
        const referralCode = searchParams.get('startapp'); // Проверяем реферальный код
  
        if (referralCode) {
          //setStartParam(referralCode);
          console.log('Referral code from URL:', referralCode);
        }
  
        if (tgWebAppData) {
          try {
            const userParam = new URLSearchParams(tgWebAppData).get('user');
            const decodedUserParam = userParam ? decodeURIComponent(userParam) : null;
            const userObject = decodedUserParam ? JSON.parse(decodedUserParam) : null;
  
            if (userObject) {
              const userData: UserData = {
                TelegramId: String(userObject.id || '12345'),
                first_name: userObject.first_name || 'Имя',
                last_name: userObject.last_name || 'Фамилия',
                username: userObject.username || 'username',
                language_code: userObject.language_code || 'en',
                is_premium: userObject.is_premium || false,
                ecobalance: 0,
              };
  
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
                    fetchUserData(userData.TelegramId);
                    fetchUserMining(userData.TelegramId);
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
          // Тестовые данные
          const testReferralCode = searchParams.get('startapp') || 'TEST_CODE';
          setStartParam(testReferralCode);
  
          const UserData: UserData = {
            TelegramId: '12345', // Тестовые данные
            first_name: 'Test User',
            last_name: 'Testov',
            username: 'testuser',
            language_code: 'en',
            is_premium: true,
            ecobalance: 0,
          };
  
          console.log('Test referral code:', testReferralCode);
  
          fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(UserData),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.error) {
                setError(data.error);
              } else {
                fetchUserData(UserData.TelegramId);
                fetchUserMining(UserData.TelegramId);
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
  }, [setUserInStore]);
  

  // Функция для получения данных пользователя с сервера
  const fetchUserData = async (TelegramId: string) => {
    try {
      const response = await fetch(`/api/user?TelegramId=${TelegramId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setUser(data);  // Здесь данные включают пользователя и коллекцию
        localStorage.setItem('userData', JSON.stringify(data));
        setUserInStore(data);
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError('Failed to fetch user data');
    }
  };
  
  // Функция для получения данных пользователя с сервера
  const fetchUserMining = async (TelegramId: string) => {
    try {
      const response = await fetch(`/api/userMining?TelegramId=${TelegramId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setUserMining(data);  
        localStorage.setItem('userMining', JSON.stringify(data));
        // Преобразуем строку lastClaim в Date и сохраняем в состоянии
      const lastClaimDate = new Date(data.lastClaim);
      setLastClaim(lastClaimDate); // Устанавливаем состояние lastClaim
        
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError('Failed to fetch user data');
    }
  };


  

  

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

