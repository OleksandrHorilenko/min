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
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
  
      const initDataUnsafe = tg.initDataUnsafe || {};
  
      if (initDataUnsafe.user) {
        // Отправляем данные пользователя из Telegram на сервер
        fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(initDataUnsafe.user),
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
        setError('No user data available');
      }
    } else {
      // Если не в Telegram, используем тестовые данные
      const testUserData: UserData = {
        id: 12345,
        first_name: 'Test User',
        last_name: 'Testov',
        username: 'testuser',
        language_code: 'en',
        is_premium: true,
      };
  
      fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
