'use client';

import { useEffect, useState } from 'react';
import CheckFootprint from '@/components/CheckFootprint';
import NavigationBar from '@/components/NavigationBar';
import TabContainer from '@/components/TabContainer';
import Loader from '@/components/Loader';
import { TabProvider } from '@/contexts/TabContext';
import useUserStore from '../stores/useUserStore';
import { WebApp } from '@twa-dev/types';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        openLink: (url: string) => void;
        initData: string;
        initDataUnsafe: Record<string, unknown>;
        close: () => void;
        requestFullscreen: () => void;
        exitFullscreen: () => void;
        isFullscreen?: boolean;
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
  const [urlData, setUrlData] = useState<string>(''); // Для отображения данных URL
  const [referralCode, setReferralCode] = useState('');
  const startParam = useUserStore((state) => state.startParam);
  const setStartParam = useUserStore((state) => state.setStartParam);
  const { setUser: setUserInStore } = useUserStore();

  // Функция для извлечения и обработки параметров из URL
  const extractParams = () => {
    if (typeof window !== 'undefined') {
      const fullUrl = window.location.href;
      const searchParams = new URLSearchParams(window.location.search);
      const startapp = searchParams.get('startapp');
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const tgWebAppData = hashParams.get('tgWebAppData');
      const refCodeFromHash = hashParams.get('startapp');

      const urlInfo = `
        Full URL: ${fullUrl}
        Query Params: ${window.location.search}
        Hash Params: ${window.location.hash}
        Startapp Param (query): ${startapp}
        Startapp Param (hash): ${refCodeFromHash}
        tgWebAppData: ${tgWebAppData}
      `;
      setUrlData(urlInfo);

      // Извлекаем реферальный код из query параметров или хеш-сегмента
      if (startapp) {
        const referralCode = startapp.replace('r_', '');
        setReferralCode(referralCode);
        localStorage.setItem('referralCode', referralCode);
        handleReferral(referralCode);
      } else if (refCodeFromHash) {
        const referralCode = refCodeFromHash.replace('r_', '');
        setReferralCode(referralCode);
        localStorage.setItem('referralCode', referralCode);
        handleReferral(referralCode);
      }

      // Обработка данных из tgWebAppData
      if (tgWebAppData) {
        try {
          const userParam = new URLSearchParams(tgWebAppData).get('user');
          const decodedUserParam = userParam ? decodeURIComponent(userParam) : null;
          const userObject = decodedUserParam ? JSON.parse(decodedUserParam) : null;

          if (userObject) {
            const userData: UserData = {
              TelegramId: String(userObject.id || '67890'),
              first_name: userObject.first_name || 'Имя',
              last_name: userObject.last_name || 'Фамилия',
              username: userObject.username || 'username',
              language_code: userObject.language_code || 'en',
              is_premium: userObject.is_premium || false,
              ecobalance: 0,
            };
            checkAndCreateUser(userData);
          } else {
            console.error('Не удалось разобрать данные пользователя из URL.');
            setError('Неверные данные пользователя в URL');
          }
        } catch (err) {
          console.error('Ошибка при разборе tgWebAppData:', err);
          setError('Ошибка при разборе tgWebAppData');
        }
      }
    }
  };

  // Обработчик реферальных данных
  const handleReferral = (referralCode: string) => {
    const TelegramId = user?.TelegramId;
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
  };

  // Функция для проверки и создания пользователя
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

  // Функция для создания нового пользователя
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

  // Функция для отправки данных реферала
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

  useEffect(() => {
    extractParams();
  }, [user]); // Вызовем при изменении user

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <TabProvider>
          <main className="min-h-screen bg-black text-white">
            <CheckFootprint />
            <div>
              <h1>URL Data:</h1>
              <pre>{urlData}</pre> {/* Отображаем данные URL на странице */}
            </div>
            <TabContainer />
            <NavigationBar />
          </main>
        </TabProvider>
      )}
    </>
  );
}
