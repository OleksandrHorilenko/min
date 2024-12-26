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
      const tg = window.Telegram.WebApp
      tg.ready()

      const initData = tg.initData || ''
      const initDataUnsafe = tg.initDataUnsafe || {}

      if (initDataUnsafe.user) {
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
              setError(data.error)
            } else {
              setUser(data)
            }
          })
          .catch((err) => {
            setError('Failed to fetch user data')
          })
      } else {
        setError('No user data available')
      }
    } else {
      setError('This app should be opened in Telegram')
    }
  }, [])


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
