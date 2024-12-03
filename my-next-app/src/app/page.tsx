// app/page.tsx

/**
 * This project was developed by Nikandr Surkov.
 * 
 * YouTube: https://www.youtube.com/@NikandrSurkov
 * GitHub: https://github.com/nikandr-surkov
 */
'use client'

import CheckFootprint from '@/components/CheckFootprint'
import NavigationBar from '@/components/NavigationBar'
import TabContainer from '@/components/TabContainer'
import { TabProvider } from '@/contexts/TabContext'
//import WebApp from '@twa-dev/sdk'
import { useEffect, useState } from 'react'
import { WebApp } from '@twa-dev/types'

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
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
  const [userData, setUserData] = useState<UserData | null>(null)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState('')

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.Telegram?.WebApp) {
        // Если приложение открыто в Telegram
        const tg = window.Telegram.WebApp;
        tg.ready(); // Готовим WebApp

        const initData = tg.initData || ''
        const initDataUnsafe = tg.initDataUnsafe || {};
        
        if (initDataUnsafe.user) {
          // Если есть данные пользователя из Telegram
          const user = initDataUnsafe.user as UserData;
          setUserData(user);
          localStorage.setItem('userData', JSON.stringify(user)); // Сохраняем в localStorage
  
          // Отправляем данные на сервер
          fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
              setError('Failed to fetch user data');
            });
        } else {
          setError('No user data available');
        }
      } else {
        // Если не в Telegram, подгружаем тестовые данные
        const testUserData = {
          id: 12345,
          first_name: 'Test User',
          last_name: 'Testov',
          username: 'testuser',
          language_code: 'en',
          is_premium: true,
        };
        setUserData(testUserData);
        localStorage.setItem('userData', JSON.stringify(testUserData)); // Сохраняем тестовые данные
  
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
            setError('Failed to send test user data');
          });
  
        setError('This app should be opened in Telegram');
      }
    }
  }, []);
  

  return (
    <TabProvider>
      <main className="min-h-screen bg-black text-white">
        <CheckFootprint /> {/* Компонент CheckFootprint теперь не нуждается в пропсах */}
        <TabContainer />
        <NavigationBar />
      </main>
    </TabProvider>
  )
}
