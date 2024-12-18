'use client';

import { sun } from '@/images';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import useUserStore from "@/stores/useUserStore";

interface FriendsTabProps {
    initData: string
    userId: string
    startParam: string
  }


const INVITE_URL = ' https://t.me/smchangebot/tabtest'; // URL для реферальной ссылки

const FriendsTab = () => {
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();  // Получаем пользователя из Zustand
  const startParam = useUserStore((state) => state.startParam);
  const setStartParam = useUserStore((state) => state.setStartParam);

  useEffect(() => {
    // Функция для получения данных о реферальном коде и рефералах
    const fetchReferralData = async () => {
      if (!user?.TelegramId) {
        console.error('TelegramId is missing');
        return;
      }

      try {
        const response = await fetch(`/api/referrals?TelegramId=${user.TelegramId}`, {
          method: "GET", // Указываем метод GET
          headers: { "Content-Type": "application/json" }, // Указываем заголовки
        });

        if (!response.ok) throw new Error('Failed to fetch referral data');
        const data = await response.json();
        setReferralCode(data.referralCode);
        setReferrals(data.referrals || []);
      } catch (error) {
        console.error('Error fetching referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [user]);

  // Функция для копирования ссылки
  const handleCopyLink = () => {
    const inviteLink = `${INVITE_URL}?startapp=${referralCode}`;
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard!');
  };

  if (loading) {
    return <p className="text-center text-xl text-gray-500">Loading...</p>;
  }

  return (
    <div className="friends-tab-con px-4 pb-24 transition-all duration-300">
      {/* Header Text */}
      <div className="pt-8 space-y-1">
        <h1 className="text-3xl font-bold">INVITE FRIENDS</h1>
        <div className="text-xl">
          <span className="font-semibold">SHARE</span>
          <span className="ml-2 text-gray-500">YOUR INVITATION</span>
        </div>
        <div className="text-xl">
          <span className="text-gray-500">LINK &</span>
          <span className="ml-2 font-semibold">GET 10%</span>
          <span className="ml-2 text-gray-500">OF</span>
        </div>
        <div className="text-gray-500 text-xl">FRIEND'S POINTS</div>
      </div>

      {/* Referral Code and Referrals List */}
      <div className="mt-8">
        <div className="bg-[#151516] w-full rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white">Your Referral Code</h2>
          <p className="text-lg text-gray-300 mt-2">{referralCode}</p>
          <p>Start Param: {startParam}</p>
          <h2 className="text-xl font-bold text-white mt-6">Your Referrals</h2>
          {referrals.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {referrals.map((referral, index) => (
                <li key={index} className="text-lg text-gray-300">
                  {referral}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No referrals yet.</p>
          )}
        </div>
      </div>

      {/* Fixed Invite Button */}
      <div className="fixed bottom-[80px] left-0 right-0 py-4 flex justify-center">
        <div className="w-full max-w-md px-4">
          <button
            onClick={handleCopyLink}
            className="w-full bg-[#4c9ce2] text-white py-4 rounded-xl text-lg font-medium"
          >
            Copy Invite Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendsTab;

