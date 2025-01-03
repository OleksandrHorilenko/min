'use client';

import { useState, useEffect } from 'react';
import useUserStore from "@/stores/useUserStore";

const INVITE_URL = 'https://t.me/smchangebot/tabtest'; // URL для реферальной ссылки

const FriendsTab = () => {
  const [referralCode, setReferralCode] = useState<string>(''); // Указали тип для referralCode
  const [referrals, setReferrals] = useState<string[]>([]); // Указали тип для referrals
  const [myRefCode, setMyRefCode] = useState<string>(''); // Указали тип для referrals
  const [loading, setLoading] = useState<boolean>(true); // Указали тип для loading
  const { user } = useUserStore();  // Получаем пользователя из Zustand
  const startParam = useUserStore((state) => state.startParam); // Получаем startParam
  const setStartParam = useUserStore((state) => state.setStartParam); // Функция для обновления startParam
  //const [referrals, setReferrals] = useState<string[]>([]); // Список рефералов
  //const [myRefCode, setMyRefCode] = useState<string>(''); // Мой реферальный код
  //const TelegramID = user.TelegramId;
  const addReferral = async (TelegramId: string, referralCode: string) => {
    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ TelegramId, referralCode }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Ошибка при добавлении реферала:', data.error);
        return { success: false, error: data.error };
      }
  
      console.log('Реферал успешно добавлен:', data.message);
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Ошибка сети или сервера:', error);
      return { success: false, error: 'Ошибка сети или сервера' };
    }
  };

  useEffect(() => {
    const initWebApp = async () => {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready(); // Инициализируем WebApp
        // Явно указываем тип, что это строка или пустая строка
        //const referralCodeFromStart: string = WebApp.initDataUnsafe.start_param || ''; 
  
        // Получаем start_param и обрабатываем его
        const referralCodeFromStart: string = WebApp.initDataUnsafe.start_param || '';
        const trimmedReferralCode = referralCodeFromStart.slice(2);
  
        setStartParam(trimmedReferralCode); // Обновляем startParam в Zustand
        setReferralCode(trimmedReferralCode); // Также сохраняем его в локальном состоянии
        //fetchReferralData(referralCodeFromStart);
  
        // Проверяем, что user.TelegramId и referralCode доступны перед вызовом addReferral
        if (user?.TelegramId && trimmedReferralCode) {
          const result = await addReferral(user.TelegramId, trimmedReferralCode);
          if (result.success) {
            console.log('Реферал успешно добавлен');
          } else {
            console.error('Ошибка при добавлении реферала:', result.error);
          }
        }
      }
    };
  
    initWebApp();
  //}, [user, setStartParam]); // Запускаем только когда user или setStartParam меняются
  }, [user, referralCode]); // Добавляем зависимости
  


  // Получение данных о рефералах
  useEffect(() => {
    const fetchReferralData = async () => {
      if (!user?.TelegramId) {
        console.error('TelegramId отсутствует');
        return;
      }

      try {
        const response = await fetch(`/api/referrals?TelegramId=${user.TelegramId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error('Ошибка при получении данных о рефералах');
        const data = await response.json();
        setReferrals(data.referrals || []);
        setMyRefCode(data.referralCode || '');
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [user]);

  // Копирование ссылки
  const handleCopyLink = () => {
    const inviteLink = `${INVITE_URL}?startapp=r_${myRefCode}`;
    navigator.clipboard.writeText(inviteLink);
    alert('Пригласительная ссылка скопирована в буфер обмена!');
  };

  if (loading) {
    return <p className="text-center text-xl text-gray-500">Загрузка...</p>;
  }

  return (
    <div className="friends-tab-con px-4 pb-24 transition-all duration-300">
      {/* Заголовок */}
      <div className="pt-8 space-y-1">
        <h1 className="text-3xl font-bold">ПРИГЛАСИТЕ ДРУЗЕЙ</h1>
        <div className="text-xl">
          <span className="font-semibold">ПОДЕЛИТЕСЬ</span>
          <span className="ml-2 text-gray-500">ВАШЕЙ ПРИГЛАСИТЕЛЬНОЙ</span>
        </div>
        <div className="text-xl">
          <span className="text-gray-500">ССЫЛКОЙ И</span>
          <span className="ml-2 font-semibold">ПОЛУЧИТЕ 10%</span>
          <span className="ml-2 text-gray-500">ОТ</span>
        </div>
        <div className="text-gray-500 text-xl">ОЧКОВ ДРУЗЕЙ</div>
      </div>

      {/* Реферальный код, извлеченный из ссылки */}
      <div className="mt-8">
        <div className="bg-[#151516] w-full rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white">Извлеченный код из ссылки</h2>
          <p className="text-lg text-gray-300 mt-2">{referralCode || 'Код отсутствует'}</p>
          <h2 className="text-xl font-bold text-white mt-6">Ваш реферальный код</h2>
          <p className="text-lg text-gray-300 mt-2">{myRefCode || 'Не доступен'}</p>
          <h2 className="text-xl font-bold text-white mt-6">Ваши рефералы</h2>
          {referrals.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {referrals.map((referral, index) => (
                <li key={index} className="text-lg text-gray-300">
                  {referral}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">У вас пока нет рефералов.</p>
          )}
        </div>
      </div>

      {/* Кнопка для копирования ссылки */}
      <div className="fixed bottom-[80px] left-0 right-0 py-4 flex justify-center">
        <div className="w-full max-w-md px-4">
          <button
            onClick={handleCopyLink}
            className="w-full bg-[#4c9ce2] text-white py-4 rounded-xl text-lg font-medium"
          >
            Скопировать пригласительную ссылку
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendsTab;


