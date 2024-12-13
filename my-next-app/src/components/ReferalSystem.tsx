import { useState, useEffect } from 'react';
import { init, backButton } from '@telegram-apps/sdk-react'; // Проверьте, что `init` доступен
import { saveReferral, getReferrals, getReferrer } from '../stores/useUserStore'; // Убедитесь, что пути корректны

interface ReferralSystemProps {
  initData: string;
  userId: string;
  startParam: string;
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({ initData, userId, startParam }) => {
  const [referrals, setReferrals] = useState<string[]>([]);
  const [referrer, setReferrer] = useState<string | null>(null);
  const INVITE_URL = "https://t.me/referral_showcase_bot/start";

  useEffect(() => {
    const checkReferral = async () => {
      if (startParam && userId) {
        try {
          saveReferral(userId, startParam); // Сохраняем реферал через локальную функцию
        } catch (error) {
          console.error('Error saving referral:', error);
        }
      }
    };

    const fetchReferrals = async () => {
      try {
        const referrals = getReferrals(userId); // Получаем рефералов
        const referrer = getReferrer(userId); // Получаем реферера
        setReferrals(referrals);
        setReferrer(referrer);
      } catch (error) {
        console.error('Error fetching referrals:', error);
      }
    };

    checkReferral();
    fetchReferrals();
  }, [userId, startParam]);

  const handleInviteFriend = () => {
    const inviteLink = `${INVITE_URL}?startapp=${userId}`;
    const shareText = `Join me on this awesome Telegram mini app!`;
    const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
    window.open(fullUrl, '_blank'); // Открываем ссылку в новой вкладке
  };

  const handleCopyLink = () => {
    const inviteLink = `${INVITE_URL}?startapp=${userId}`;
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard!');
  };

  return (
    <div className="w-full max-w-md">
      {referrer && (
        <p className="text-green-500 mb-4">You were referred by user {referrer}</p>
      )}
      <div className="flex flex-col space-y-4">
        <button
          onClick={handleInviteFriend}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Invite Friend
        </button>
        <button
          onClick={handleCopyLink}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Copy Invite Link
        </button>
      </div>
      {referrals.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Referrals</h2>
          <ul>
            {referrals.map((referral, index) => (
              <li key={index} className="bg-gray-100 p-2 mb-2 rounded">
                User {referral}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReferralSystem;
