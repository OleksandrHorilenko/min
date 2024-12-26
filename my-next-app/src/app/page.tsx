'use client';

import CheckFootprint from '@/components/CheckFootprint';
import NavigationBar from '@/components/NavigationBar';
import TabContainer from '@/components/TabContainer';
import Loader from '@/components/Loader';
import { TabProvider } from '@/contexts/TabContext';
import { useEffect, useState } from 'react';
import { WebApp } from '@twa-dev/types';
import useUserStore from '../stores/useUserStore';
import FriendsTab from '@/components/FriendsTab';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        openLink: (url: string) => void;
        initData: string;
        initDataUnsafe: Record<string, unknown>;
        close: () => void;
        requestFullscreen: () => void; // Метод для запроса полноэкранного режима
        exitFullscreen: () => void;   // Метод для выхода из полноэкранного режима
        isFullscreen?: boolean;      // Флаг текущего состояния полноэкранного режима
        expand: () => void;
        HapticFeedback?: {
          impactOccurred: (style: "light" | "medium" | "heavy") => void;
        };
      };
    };
  }
}

interface UserData {
  TelegramId: string;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
  ecobalance: number;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState('');
  const [loader, setLoader] = useState(false);
  const [userMining, setUserMining] = useState<any>(null);
  const [lastClaim, setLastClaim] = useState<Date | null>(null);
  const [initData, setInitData] = useState('');
  const [userId, setUserId] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const startParam = useUserStore((state) => state.startParam);
  const setStartParam = useUserStore((state) => state.setStartParam);

  const { setUser: setUserInStore } = useUserStore();

  useEffect(() => {
    setLoader(true);
    const timeout = setTimeout(() => {
      setLoader(false);
    }, 7000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (user) {
      setLoader(false);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Извлекаем параметры из URL
      const urlParams = new URLSearchParams(window.location.search);
      const startapp = urlParams.get('startapp');
  
      // Проверяем, если найден реферальный код в ссылке
      if (startapp) {
        const referralCode = startapp.replace('r_', ''); // Убираем 'r_' префикс
        setReferralCode(referralCode);
        localStorage.setItem('referralCode', referralCode);
  
        // Отправляем реферал
        const TelegramId = user?.TelegramId; // ID текущего пользователя
        if (TelegramId) {
          sendReferral(TelegramId, referralCode)
            .then((result) => {
              if (result.success) {
                console.log('Реферал успешно обработан:', result.message);
              } else {
                console.error('Ошибка обработки реферала:', result.message);
              }
            })
            .catch((err) => console.error('Ошибка вызова sendReferral:', err));
        }
      }
  
      // Обрабатываем данные для Telegram WebApp
      const handleTGWebAppData = () => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1)); // Используем hash, а не search
        const tgWebAppData = hashParams.get('tgWebAppData');
  
        // Извлекаем реферальный код, если он присутствует в хеш-сегменте
        const refCodeFromHash = hashParams.get('startapp');
        if (refCodeFromHash) {
          const referralCode = refCodeFromHash.replace('r_', ''); // Убираем 'r_' префикс
          setReferralCode(referralCode);
          localStorage.setItem('referralCode', referralCode);
  
          // Дополнительная логика с реферальным кодом, например, отправка на сервер
          const TelegramId = user?.TelegramId; // ID текущего пользователя
          if (TelegramId) {
            sendReferral(TelegramId, referralCode)
              .then((result) => {
                if (result.success) {
                  console.log('Реферал успешно обработан:', result.message);
                } else {
                  console.error('Ошибка обработки реферала:', result.message);
                }
              })
              .catch((err) => console.error('Ошибка вызова sendReferral:', err));
          }
        }
  
        // Обрабатываем данные, полученные из Telegram WebApp
        if (tgWebAppData) {
          try {
            const userParam = new URLSearchParams(tgWebAppData).get('user');
            const decodedUserParam = userParam ? decodeURIComponent(userParam) : null;
            const userObject = decodedUserParam ? JSON.parse(decodedUserParam) : null;
  
            if (userObject) {
              const userData = {
                TelegramId: String(userObject.id || '67890'),
                first_name: userObject.first_name || 'Имя',
                last_name: userObject.last_name || 'Фамилия',
                username: userObject.username || 'username',
                language_code: userObject.language_code || 'en',
                is_premium: userObject.is_premium || false,
                ecobalance: 0,
              };
  
              // Создаем пользователя с данными из Telegram
              checkAndCreateUser(userData);
            } else {
              console.error('Не удалось разобрать данные пользователя из URL.');
              setError('Неверные данные пользователя в URL');
            }
          } catch (err) {
            console.error('Ошибка при разборе tgWebAppData:', err);
            setError('Ошибка при разборе tgWebAppData');
          }
        } else {
          // Если tgWebAppData нет, создаем тестового пользователя
          const testUser = {
            TelegramId: '123456',
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
            language_code: 'en',
            is_premium: false,
            ecobalance: 100, // Пример тестового баланса
          };
  
          checkAndCreateUser(testUser); // Создаем тестового пользователя
        }
      };
  
      // Инициализируем данные WebApp, если они есть
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        handleTGWebAppData(); // Вызываем обработку данных
      } else {
        handleTGWebAppData(); // Обрабатываем данные, если WebApp не найден
      }
    }
  }, []); // Зависимость от user, если требуется обновление
  
  

  const checkAndCreateUser = async (user: UserData) => {
    try {
      const response = await fetch(`/api/user?TelegramId=${user.TelegramId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const existingUser = await response.json();
        if (existingUser) {
          setUser(existingUser);
          setUserInStore(existingUser);
          localStorage.setItem('userData', JSON.stringify(existingUser));
        } else {
          await createUser(user);
        }
      } else {
        await createUser(user);
      }
    } catch (err) {
      console.error('Error checking user existence:', err);
    }
  };

  const createUser = async (user: UserData) => {
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const newUser = await response.json();
        setUser(newUser);
        setUserInStore(newUser);
        localStorage.setItem('userData', JSON.stringify(newUser));
      } else {
        console.error('Failed to create user:', await response.text());
      }
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };


  async function sendReferral(TelegramId: string, referralCode: string) {
    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ TelegramId, referralCode }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Ошибка при отправке реферала:', errorData.error);
        return { success: false, message: errorData.error };
      }
  
      const data = await response.json();
      console.log('Реферал успешно добавлен:', data.message);
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Внутренняя ошибка при отправке реферала:', error);
      return { success: false, message: 'Ошибка сети или сервера' };
    }
  }

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <TabProvider>
          <main className="min-h-screen bg-black text-white">
            <CheckFootprint />
            <TabContainer />
            <NavigationBar />
          </main>
        </TabProvider>
      )}
    </>
  );
}
