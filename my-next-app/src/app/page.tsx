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
        requestFullscreen?: () => void;
        exitFullscreen?: () => void;
        isFullscreen?: boolean;
        expand: () => void;
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
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
    const timeout = setTimeout(() => setLoader(false), 7000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (user) {
      setLoader(false);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      if (tg.requestFullscreen) {
        tg.requestFullscreen();
      } else {
        console.warn('Fullscreen not supported.');
      }

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

        if (!rawUser) {
          console.error('No user data found in initDataUnsafe.');
          return;
        }

        const user: UserData = {
          TelegramId: String(rawUser.id),
          first_name: rawUser.first_name,
          last_name: rawUser.last_name,
          username: rawUser.username,
          language_code: rawUser.language_code,
          is_premium: rawUser.is_premium,
          ecobalance: 0,
        };

        checkAndCreateUser(user);
      } else {
        handleTGWebAppData();
      }
    } else {
      handleTGWebAppData();
    }
  }, []);

  const handleTGWebAppData = () => {
    const searchParams = new URLSearchParams(window.location.hash.substring(1));
    const tgWebAppData = searchParams.get('tgWebAppData');

    if (tgWebAppData) {
      try {
        const userParam = new URLSearchParams(tgWebAppData).get('user');
        const referralParam = new URLSearchParams(tgWebAppData).get('r_');

        if (referralParam) {
          setReferralCode(referralParam);
        }

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
          console.error('Failed to parse user data from URL.');
          setError('Invalid user data in URL');
        }
      } catch (err) {
        console.error('Error parsing tgWebAppData:', err);
        setError('Error parsing tgWebAppData');
      }
    } else {
      const testUser: UserData = {
        TelegramId: '123456',
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        language_code: 'en',
        is_premium: false,
        ecobalance: 100,
      };

      checkAndCreateUser(testUser);
    }
  };

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

          if (referralCode) {
            await addReferral(existingUser.TelegramId, referralCode);
          }
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

        if (referralCode) {
          await addReferral(newUser.TelegramId, referralCode);
        }
      } else {
        console.error('Failed to create user:', await response.text());
      }
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  const addReferral = async (userId: string, referralCode: string) => {
    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, referralCode }),
      });

      if (!response.ok) {
        console.error('Failed to add referral:', await response.text());
      }
    } catch (err) {
      console.error('Error adding referral:', err);
    }
  };

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
