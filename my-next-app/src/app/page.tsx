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
import WebApp from '@twa-dev/sdk'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      // Проверяем, что код выполняется в браузере
      if (WebApp.initDataUnsafe?.user) {
        const user = WebApp.initDataUnsafe.user as UserData;
        setUserData(user);
        localStorage.setItem('userData', JSON.stringify(user)); // Сохраняем данные в localStorage
      } else {
        // Если пользователь не из Telegram, ставим тестовые данные
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
