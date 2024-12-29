'use client';

import { useState } from 'react';
import useUserStore from "@/stores/useUserStore";
import { FaShareAlt, FaUserFriends, FaDollarSign } from "react-icons/fa";

const INVITE_URL = 'https://t.me/smchangebot/tabtest';

const FriendsTab = () => {
  const [referralCode, setReferralCode] = useState<string>('');
  const [referrals, setReferrals] = useState<string[]>([]);
  const [referralDetails, setReferralDetails] = useState<any[]>([]);
  const [myRefCode, setMyRefCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showReferrals, setShowReferrals] = useState<boolean>(false);
  const { user } = useUserStore();


  const handleShowReferrals = async () => {
    if (!user?.TelegramId) {
      console.error('TelegramId отсутствует');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/referrals?TelegramId=${user.TelegramId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    
      if (!response.ok) throw new Error('Ошибка при получении данных о рефералах');
      const data = await response.json();
    
      // Удаление дубликатов рефералов
      const uniqueReferrals: string[] = Array.from(new Set(data.referrals || []) as Set<string>);
      setReferrals(uniqueReferrals);
    
      // Получение деталей каждого реферала
      const userDetails = await Promise.allSettled(
        uniqueReferrals.map(async (referral) => {
          const userResponse = await fetch(`/api/user?TelegramId=${referral}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          if (!userResponse.ok) throw new Error('Ошибка при загрузке данных пользователя');
          return await userResponse.json();
        })
      );
    
      setReferralDetails(userDetails);
    } catch (error) {
      console.error('Ошибка при загрузке данных рефералов:', error);
    } finally {
      setLoading(false);
      setShowReferrals(true);
      //console.log(referral); 
    }
  };  

  const handleCopyLink = () => {
    const inviteLink = `${INVITE_URL}?startapp=r_${myRefCode}`;
    navigator.clipboard.writeText(inviteLink);
    alert('Пригласительная ссылка скопирована в буфер обмена!');
  };

  const handleReward = (referralId: string) => {
    alert(`Награда за реферала ${referralId} получена!`);
    // Логика обработки награды может быть добавлена здесь
  };

  if (loading && showReferrals) {
    return <p className="text-center text-xl text-gray-500">Загрузка...</p>;
  }

  return (
    <div className="friends-tab-con px-4 pb-24 transition-all duration-300">
      {/* Заголовок */}
      {/* Header */}
<div className="pt-8 space-y-1">
  <h1 className="text-3xl font-bold">INVITE YOUR FRIENDS</h1>
  
  <div className="text-xl">
    <span className="text-gray-500">AND</span>
    <span className="ml-2 font-semibold">EARN 5%</span>
    <span className="ml-2 text-gray-500">FROM</span>
  </div>
  <div className="text-gray-500 text-xl">YOUR FRIENDS' MINING TOKENS</div>
</div>
{/* Кнопка для загрузки рефералов */}
<div className="p-8 bg-black rounded-lg shadow-md border border-gray-300">
      <h2 className="text-2xl font-bold text-center text-white mb-6">
        How it works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center h-full space-y-4">
          <FaShareAlt className="text-blue-500 text-4xl" />
          <h3 className="font-semibold text-lg text-white">Share Link</h3>
          <p className="text-gray-400">
            Share your unique invitation link with friends.
          </p>
        </div>
        {/* Step 2 */}
        <div className="flex flex-col items-center text-center h-full space-y-4">
          <FaUserFriends className="text-green-500 text-4xl" />
          <h3 className="font-semibold text-lg text-white">Invite a Friend</h3>
          <p className="text-gray-400">
            Get <span className="font-semibold text-white">$100 THE</span> for each referral.
          </p>
        </div>
        {/* Step 3 */}
        <div className="flex flex-col items-center text-center h-full space-y-4">
          <FaDollarSign className="text-yellow-500 text-4xl" />
          <h3 className="font-semibold text-lg text-white">Earn Rewards</h3>
          <p className="text-gray-400">
            Earn <span className="font-semibold text-white">5% THE</span> from their mining income.
          </p>
        </div>
      </div>
    </div>
      {/* Кнопка для загрузки рефералов */}
      <div className="mt-8">
        <button
          onClick={handleShowReferrals}
          className="w-full bg-[#4c9ce2] text-white py-2 rounded-xl text font-medium"
        >
          Get my referals
        </button>
      </div>

      {showReferrals && (
  <div className="mt-8">
    <div className="bg-[#151516] w-full rounded-2xl p-8">
      <h2 className="text-xl font-bold text-white">Your referals</h2>
      {referralDetails.length > 0 ? (
  <ul className="mt-2 space-y-2">
    {referralDetails.map((detail, index) => {
      console.log(detail); // Логируем каждый detail
      console.log(referralDetails); // Выведите весь массив перед рендером
      return (
        <li key={detail._id || index} className="text-lg text-gray-300 flex justify-between items-center">
          <div>
            
            <p>
              <span className="font-bold"></span> {detail.value.first_name || 'Не указано'} {detail.last_name || ''}
            </p>
            
          </div>
          <button
            onClick={() => handleReward(detail.value.first_name)} // Используем detail.TelegramId
            className="bg-green-500 text-white px-3 py-1 rounded-lg"
          >
            Get reward
          </button>
        </li>
      );
    })}
  </ul>
) : (
  <p className="text-gray-500 mt-2">You have not referals</p>
)}
    </div>
  </div>
)}

      {/* Кнопка для копирования ссылки */}
      <div className="fixed bottom-[80px] left-0 right-0 py-4 flex justify-center">
        <div className="w-full max-w-md px-4">
          <button
            onClick={handleCopyLink}
            className="w-full bg-[#4c9ce2] text-white py-4 rounded-xl text-lg font-medium"
          >
            Copy invite link
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendsTab;


