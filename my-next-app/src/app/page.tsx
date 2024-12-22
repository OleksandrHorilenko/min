'use client';

import CheckFootprint from '@/components/CheckFootprint';
import NavigationBar from '@/components/NavigationBar';
import TabContainer from '@/components/TabContainer';
import Loader from '@/components/Loader';
import { TabProvider } from '@/contexts/TabContext';
import { useEffect, useState } from 'react';
import useUserStore from '../stores/useUserStore';

// Define the interface for user data
interface UserData {
  TelegramId: string;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
  ecobalance: number;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        openLink: (url: string) => void;
        initData: string;
        initDataUnsafe: Record<string, unknown>;
        close: () => void;
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
        };
      };
    };
  }
}

export default function Home() {
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loader, setLoader] = useState(true);
  const startParam = useUserStore((state) => state.startParam);
  const setStartParam = useUserStore((state) => state.setStartParam);
  const { setUser: setUserInStore } = useUserStore();

  // Function to initialize user
  const handleUserInitialization = async (user: UserData) => {
    try {
      // Step 1: Check if user exists in the database
      const response = await fetch(`/api/user?TelegramId=${user.TelegramId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const existingUser = await response.json();

        if (existingUser) {
          // User found, update state and localStorage
          setUser(existingUser);
          localStorage.setItem('userData', JSON.stringify(existingUser));
          setUserInStore(existingUser);
          console.log('User already exists:', existingUser);
          return;
        }
      }

      // Step 2: If user does not exist, create new user
      const createResponse = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create user');
      }

      const newUser = await createResponse.json();
      setUser(newUser);
      localStorage.setItem('userData', JSON.stringify(newUser));
      setUserInStore(newUser);
      console.log('New user created:', newUser);
    } catch (error) {
      console.error('Error initializing user:', error);
      setError('Error initializing user');
    }
  };

  // useEffect for initializing user data
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const initDataUnsafe = tg.initDataUnsafe || {};

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

        handleUserInitialization(user);
      } else {
        setError('No user data available from Telegram');
      }
    }
  }, [setUserInStore]);

  // Referral logic
  useEffect(() => {
    const referralCodeFromStart = startParam || '';

    if (referralCodeFromStart && user?.TelegramId) {
      fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          TelegramId: user.TelegramId,
          referralCode: referralCodeFromStart,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log('Referral added successfully!');
          } else {
            console.error('Failed to add referral:', data.error);
          }
        })
        .catch((error) => {
          console.error('Error adding referral:', error);
        });
    } else {
      console.error('user or TelegramId is null or undefined');
    }
  }, [startParam, user?.TelegramId]);

  // Loader logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoader(false);
    }, 7000);

    return () => clearTimeout(timeout);
  }, []);

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
