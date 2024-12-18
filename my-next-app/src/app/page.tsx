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
  const [startParam, setStartParam] = useState('');

  const { setUser: setUserInStore } = useUserStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready(); // Готовим WebApp

        const initData = tg.initData || '';
        const initDataUnsafe = tg.initDataUnsafe || {};

        console.log('Telegram initData:', initData);
        console.log('Telegram initDataUnsafe:', initDataUnsafe);

        if (initDataUnsafe.user) {
          const rawUser = initDataUnsafe.user as unknown as {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code: string;
            is_premium?: boolean;
          };

          const user: UserData = {
            TelegramId: String(rawUser.id),
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
                alert('Ошибка: ' + data.error);
              } else {
                fetchUserData(user.TelegramId);
                fetchUserMining(user.TelegramId);

                const referralCode = getReferralCode();
                if (referralCode) {
                  alert('Реферальный код: ' + referralCode);
                  addReferral(user.TelegramId, referralCode);
                } else {
                  alert('Реферальный код не найден');
                }
              }
            })
            .catch((err) => {
              console.error('Failed to send user data:', err);
              setError('Failed to send user data');
              alert('Не удалось отправить данные пользователя');
            });
        } else {
          setError('No user data available from Telegram');
          alert('Нет данных о пользователе');
          console.error('No user data available from Telegram:', initDataUnsafe);
        }
      } else {
        const searchParams = new URLSearchParams(window.location.hash.substring(1));
        const tgWebAppData = searchParams.get('tgWebAppData');

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
                    alert('Ошибка: ' + data.error);
                  } else {
                    fetchUserData(userData.TelegramId);
                    fetchUserMining(userData.TelegramId);

                    const referralCode = getReferralCode();
                    if (referralCode) {
                      alert('Реферальный код: ' + referralCode);
                      addReferral(userData.TelegramId, referralCode);
                    } else {
                      alert('Реферальный код не найден');
                    }
                  }
                })
                .catch((err) => {
                  console.error('Failed to send user data:', err);
                  setError('Failed to send user data');
                  alert('Не удалось отправить данные пользователя');
                });
            } else {
              console.error('Failed to parse user data from URL.');
              setError('Invalid user data in URL');
              alert('Ошибка в данных пользователя');
            }
          } catch (err) {
            console.error('Error parsing tgWebAppData:', err);
            setError('Error parsing tgWebAppData');
            alert('Ошибка парсинга данных');
          }
        } else {
          const UserData: UserData = {
            TelegramId: '12345',
            first_name: 'Test User',
            last_name: 'Testov',
            username: 'testuser',
            language_code: 'en',
            is_premium: true,
            ecobalance: 0
          };

          fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(UserData),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.error) {
                setError(data.error);
                alert('Ошибка: ' + data.error);
              } else {
                fetchUserData(UserData.TelegramId);
                fetchUserMining(UserData.TelegramId);

                const referralCode = getReferralCode();
                if (referralCode) {
                  alert('Реферальный код: ' + referralCode);
                  addReferral(UserData.TelegramId, referralCode);
                } else {
                  alert('Реферальный код не найден');
                }
              }
            })
            .catch((err) => {
              console.error('Failed to send test user data:', err);
              setError('Failed to send test user data');
              alert('Не удалось отправить тестовые данные пользователя');
            });

          setError('This app should be opened in Telegram');
          alert('Приложение должно быть открыто в Telegram');
        }
      }
    }
  }, [setUserInStore]);

  const fetchUserData = async (TelegramId: string) => {
    try {
      const response = await fetch(`/api/user?TelegramId=${TelegramId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        alert('Ошибка: ' + data.error);
      } else {
        setUser(data);
        localStorage.setItem('userData', JSON.stringify(data));
        setUserInStore(data);
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError('Failed to fetch user data');
      alert('Не удалось получить данные пользователя');
    }
  };

  const getReferralCode = () => {
    // Логируем URL с которого извлекаем параметры
    console.log('Current URL:', window.location.href);

    const urlParams = new URLSearchParams(window.location.search);
    let referralCode = urlParams.get('startapp');
    console.log('Referral code from search:', referralCode);

    if (!referralCode) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      referralCode = hashParams.get('startapp');
      console.log('Referral code from hash:', referralCode);
    }

    return referralCode;
  };

  const fetchUserMining = async (TelegramId: string) => {
    try {
      const response = await fetch(`/api/userMining?TelegramId=${TelegramId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        alert('Ошибка: ' + data.error);
      } else {
        setUserMining(data);
        localStorage.setItem('userMining', JSON.stringify(data));
        const lastClaimDate = new Date(data.lastClaim);
        setLastClaim(lastClaimDate);
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError('Failed to fetch user data');
      alert('Не удалось получить данные майнинга');
    }
  };

  const addReferral = (TelegramId: string, referralCode: string) => {
    fetch('/api/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        TelegramId,
        referralCode,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          alert('Ошибка при добавлении реферала: ' + data.error);
        } else {
          setNotification('Referral added successfully!');
          alert('Реферал добавлен успешно!');
        }
      })
      .catch((err) => {
        console.error('Failed to add referral:', err);
        setError('Failed to add referral');
        alert('Не удалось добавить реферал');
      });
  };

  return (
    <TabProvider>
      <main className="min-h-screen bg-black text-white">
        <CheckFootprint />
        
        <TabContainer /><div>
          <p>Текущий URL: {window.location.href}</p>
          <p>Реферальный код: {getReferralCode()}</p>
        </div>
        <NavigationBar />
        {/* Выводим URL и реферальный код */}
        <div>
          <p>Текущий URL: {window.location.href}</p>
          <p>Реферальный код: {getReferralCode()}</p>
        </div>
      </main>
    </TabProvider>
  );
}
