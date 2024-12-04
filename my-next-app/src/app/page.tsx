'use client';

import CheckFootprint from '@/components/CheckFootprint';
import NavigationBar from '@/components/NavigationBar';
import TabContainer from '@/components/TabContainer';
import Wallet from '@/components/Wallet';
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
  const [loader, setLoader] = useState(false);

  

  useEffect(() => {
    const loadData = async () => {
      let userData: UserData | null = null;
  
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        // Проверяем, что приложение открыто в Telegram
        const tg = window.Telegram.WebApp;
        tg.ready(); // Инициализация Telegram WebApp
  
        const telegramUser = tg.initDataUnsafe?.user || null;
  
        if (telegramUser) {
          // Преобразуем данные в формат UserData
          userData = {
            id: telegramUser.id,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name || '', // Предоставляем значение по умолчанию
            username: telegramUser.username || '', // Предоставляем значение по умолчанию
            language_code: telegramUser.language_code || 'en', // Предоставляем значение по умолчанию для language_code
            is_premium: telegramUser.is_premium || false, // Предоставляем значение по умолчанию для is_premium
          };
        }
      }
  
      if (!userData) {
        // Если не в Telegram, используем тестовые данные
        userData = {
          id: 12345,
          first_name: 'Test User',
          last_name: 'Testov',
          username: 'testuser',
          language_code: 'en',
          is_premium: true,
        };
        setError('This app should be opened in Telegram, using test data.');
      }
  
      if (userData) {
        setUserData(userData); // Сохраняем данные пользователя
        localStorage.setItem('userData', JSON.stringify(userData)); // Кэшируем в localStorage
  
        try {
          const response = await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });
          const data = await response.json();
          if (data.error) {
            setError(data.error);
          } else {
            setUser(data);
          }
        } catch (err) {
          console.error('Failed to send user data:', err);
          setError('Failed to send user data');
        }
      }
    };
  
    loadData();
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
